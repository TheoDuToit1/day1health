import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, FileText, FolderOpen, GripVertical, LayoutPanelLeft, Loader, Plus, RefreshCcw, Save, Search, Trash2, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { hasSupabaseEnv, supabase, supabaseConfigError } from './supabaseClient';
import {
  buildAuditSummary,
  CmsAuditAction,
  CmsChangeLogInsert,
  CmsChangeLogRow,
  diffRecords,
  downloadMonthlyDocxReport,
  formatDuration,
  getCurrentMonthInputValue,
  getDurationSeconds,
  monthInputToRange,
} from './cmsReporting';

type CmsRow = Record<string, any> & { id: string };
type CmsTableKey = 'benefits' | 'coverHighlights' | 'priceRows' | 'assets';
type EditorTabKey = 'page' | CmsTableKey;
type StatusState = { type: 'success' | 'error'; message: string } | null;
type SaveRowOptions = {
  actionType?: CmsAuditAction;
  previousRow?: CmsRow | null;
  startedAt?: string;
  changeSummary?: string;
  fileNameBefore?: string | null;
  fileNameAfter?: string | null;
  auditPreviousValues?: Record<string, unknown>;
  auditNextValues?: Record<string, unknown>;
  auditChangedFields?: string[];
  allowSaveWithoutFieldDiff?: boolean;
  successMessage?: string;
};
type AuditLookupParams = {
  tableName: string;
  recordId: string;
  pageId?: string | null;
};

const HIDDEN_FIELDS = new Set(['id', 'page_id', 'created_at', 'updated_at']);
const PLAN_DOCS_BUCKET = 'plan-docs';
const CMS_CHANGE_LOG_TABLE = 'cms_change_log';
const HOSPITAL_DAY_CARD_TITLES = ['1st Day in Hospital', '2nd Day in Hospital', '3rd Day in Hospital'] as const;
const DEFAULT_HOSPITAL_DAY_CARD_SUMMARIES: Record<(typeof HOSPITAL_DAY_CARD_TITLES)[number], string> = {
  '1st Day in Hospital': 'Up to R 10 000.00 — Not less than 24 hours from time of admission to time of discharge',
  '2nd Day in Hospital': 'Up to R 10 000.00 — Payable in units of R 2 500.00 for every quarter day (6 hours)',
  '3rd Day in Hospital': 'Up to R 10 000.00 — Payable in units of R 2 500.00 for every quarter day (6 hours)',
};

const TABLE_CONFIG: Array<{ key: CmsTableKey; table: string; title: string; emptyMessage: string }> = [
  {
    key: 'benefits',
    table: 'cms_plan_benefits',
    title: 'Benefits',
    emptyMessage: 'No benefit rows found for this page.',
  },
  {
    key: 'coverHighlights',
    table: 'cms_plan_cover_highlights',
    title: 'Cover Highlights',
    emptyMessage: 'No cover highlight rows found for this page.',
  },
  {
    key: 'priceRows',
    table: 'cms_plan_price_rows',
    title: 'Pricing Rows',
    emptyMessage: 'No pricing rows found for this page.',
  },
  {
    key: 'assets',
    table: 'cms_plan_assets',
    title: 'Assets',
    emptyMessage: 'No asset rows found for this page.',
  },
];

const PREFERRED_FIELD_ORDER = [
  'sort_order',
  'plan_category',
  'plan_key',
  'route_path',
  'tier_slug',
  'variant_mode',
  'variant_key',
  'asset_type',
  'asset_label',
  'category_label',
  'label',
  'title',
  'page_heading',
  'browser_title',
  'hero_title',
  'hero_subtitle',
  'price_range',
  'section_key',
  'benefit_title',
  'benefit_summary',
  'highlight_text',
  'member_type',
  'adults',
  'children',
  'price',
  'storage_path',
  'file_name',
  'asset_url',
  'public_url',
  'is_active',
  'is_visible',
];

const createEmptyCollections = (): Record<CmsTableKey, CmsRow[]> => ({
  benefits: [],
  coverHighlights: [],
  priceRows: [],
  assets: [],
});

const createEmptyCollectionSnapshots = (): Record<CmsTableKey, Record<string, CmsRow>> => ({
  benefits: {},
  coverHighlights: {},
  priceRows: {},
  assets: {},
});

const humanizeKey = (key: string): string => key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const PLAN_FAMILY_ORDER = ['day-to-day', 'comprehensive', 'hospital', 'senior'];

const formatSlugLabel = (value: string): string =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getPlanFamilyLabel = (page: CmsRow): string => {
  const family = typeof page.plan_family === 'string' ? page.plan_family : '';

  if (family === 'day-to-day') return 'Day-to-Day';
  if (family === 'comprehensive') return 'Comprehensive';
  if (family === 'hospital') return 'Hospital';
  if (family === 'senior') return 'Senior';
  return 'Other';
};

const getPageCardTitle = (page: CmsRow): string => {
  if (typeof page.page_heading === 'string' && page.page_heading.trim().length > 0) {
    return page.page_heading;
  }

  if (typeof page.hero_title === 'string' && page.hero_title.trim().length > 0) {
    return page.hero_title;
  }

  if (typeof page.plan_key === 'string' && page.plan_key.trim().length > 0) {
    return formatSlugLabel(page.plan_key);
  }

  return page.id;
};

const getPageCardMeta = (page: CmsRow): string[] => {
  const meta: string[] = [];

  if (page.plan_family === 'comprehensive' || page.plan_family === 'hospital') {
    if (typeof page.tier === 'string' && page.tier.trim().length > 0) {
      meta.push(formatSlugLabel(page.tier));
    }
  }

  if (page.plan_family === 'senior') {
    if (typeof page.senior_category === 'string' && page.senior_category.trim().length > 0) {
      meta.push(formatSlugLabel(page.senior_category));
    }
  }

  if (typeof page.variant_mode === 'string' && page.variant_mode.trim().length > 0) {
    meta.push(formatSlugLabel(page.variant_mode));
  }

  return meta;
};

const getAssetTypeLabel = (assetType: unknown): string => {
  if (assetType === 'brochure') return 'Brochures';
  if (assetType === 'application_form') return 'Application Forms';
  return 'Other Assets';
};

const CMS_SECTION_DESCRIPTIONS: Record<CmsTableKey, string> = {
  benefits: 'Update the benefit cards that appear on the selected plan detail page.',
  coverHighlights: 'Edit the short cover highlights shown near the top of the plan page.',
  priceRows: 'Manage each pricing row used for the selected plan and family setup.',
  assets: 'Replace brochures and application forms stored in Supabase for this plan.',
};

const PAGE_FIELD_LABELS: Record<string, string> = {
  sort_order: 'Page Order',
  route_path: 'Frontend Route',
  page_heading: 'Page Heading',
  hero_title: 'Plan Name',
  hero_subtitle: 'Plan Subtitle',
  browser_title: 'Browser Title',
  price_range: 'Price Range Text',
  legal_copy: 'Legal Copy',
  variant_mode: 'Plan Variant Mode',
  tier: 'Plan Tier',
  senior_category: 'Senior Category',
  is_active: 'Active',
};

const ROW_FIELD_LABELS: Record<string, string> = {
  sort_order: 'Display Order',
  benefit_title: 'Benefit Title',
  benefit_summary: 'Benefit Description',
  highlight_text: 'Cover Highlight',
  row_key: 'Pricing Key',
  variant_type: 'Variant Type',
  adults_count: 'Adults',
  children_count: 'Children',
  price: 'Price',
  asset_label: 'Document Label',
  file_name: 'Current File Name',
};

const BASE_PAGE_FIELDS = ['page_heading', 'hero_title', 'hero_subtitle', 'price_range', 'legal_copy'];
const COMPREHENSIVE_OR_HOSPITAL_PAGE_FIELDS = BASE_PAGE_FIELDS;
const SENIOR_PAGE_FIELDS = BASE_PAGE_FIELDS;

const TAB_FIELD_ALLOWLIST: Record<CmsTableKey, string[]> = {
  benefits: ['sort_order', 'benefit_title', 'benefit_summary'],
  coverHighlights: ['sort_order', 'highlight_text'],
  priceRows: ['sort_order', 'variant_type', 'adults_count', 'children_count', 'price'],
  assets: ['asset_label', 'file_name'],
};

const EDITOR_TABS: Array<{ key: EditorTabKey; label: string; description: string }> = [
  {
    key: 'page',
    label: 'Plan Details',
    description: 'Page title, route settings, legal copy, and other main content fields.',
  },
  {
    key: 'benefits',
    label: 'Benefits',
    description: CMS_SECTION_DESCRIPTIONS.benefits,
  },
  {
    key: 'coverHighlights',
    label: 'Cover Highlights',
    description: CMS_SECTION_DESCRIPTIONS.coverHighlights,
  },
  {
    key: 'priceRows',
    label: 'Pricing',
    description: CMS_SECTION_DESCRIPTIONS.priceRows,
  },
  {
    key: 'assets',
    label: 'Assets',
    description: CMS_SECTION_DESCRIPTIONS.assets,
  },
];

const sortEditableFields = (row: CmsRow): string[] => {
  return Object.keys(row)
    .filter((key) => !HIDDEN_FIELDS.has(key))
    .sort((a, b) => {
      const leftIndex = PREFERRED_FIELD_ORDER.indexOf(a);
      const rightIndex = PREFERRED_FIELD_ORDER.indexOf(b);

      if (leftIndex === -1 && rightIndex === -1) {
        return a.localeCompare(b);
      }

      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    });
};

const isLongTextField = (key: string, value: unknown): boolean => {
  return (
    typeof value === 'string' &&
    (value.length > 90 || /summary|description|content|subtitle|text|copy|seo/i.test(key))
  );
};

const buildUpdatePayload = (row: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(Object.entries(row).filter(([key]) => !HIDDEN_FIELDS.has(key)));
};

const buildAssetPath = (page: CmsRow | null, row: CmsRow, file: File): string => {
  const existingPath = typeof row.storage_path === 'string' && row.storage_path.trim().length > 0 ? row.storage_path.trim() : null;
  if (existingPath) {
    return existingPath;
  }

  const pageKey = typeof page?.plan_key === 'string' && page.plan_key.length > 0 ? page.plan_key : page?.id ?? 'unknown-page';
  return `${pageKey}/${file.name}`;
};

const snapshotRow = (row: CmsRow): CmsRow => ({ ...row });

const snapshotRows = (rows: CmsRow[]): Record<string, CmsRow> =>
  Object.fromEntries(rows.map((row) => [row.id, snapshotRow(row)]));

const toAuditValueRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const getStringValue = (value: unknown): string | null => (typeof value === 'string' && value.trim().length > 0 ? value.trim() : null);

const resolveAssetStoragePath = (row: CmsRow): string | null => getStringValue(row.storage_path);

const buildAssetVersionPath = (storagePath: string, row: CmsRow): string => {
  const trimmedPath = storagePath.trim().replace(/^\/+/, '');
  const pathParts = trimmedPath.split('/').filter(Boolean);
  const fileName = pathParts[pathParts.length - 1] ?? `${row.id}.bin`;
  const baseDir = pathParts.slice(0, -1).join('/');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rowKey = getStringValue(row.asset_type) ?? row.id;
  const safeRowKey = rowKey.replace(/[^a-zA-Z0-9-_]/g, '-');
  return `${baseDir ? `${baseDir}/` : ''}_history/${safeRowKey}/${timestamp}-${fileName}`;
};

const buildAssetRowUpdates = (row: CmsRow, storagePath: string, fileName: string): Record<string, any> => {
  const updates: Record<string, any> = {};
  if ('storage_path' in row) updates.storage_path = storagePath;
  if ('file_name' in row) updates.file_name = fileName;

  if ('asset_url' in row || 'public_url' in row) {
    const { data } = supabase.storage.from(PLAN_DOCS_BUCKET).getPublicUrl(storagePath);
    if ('asset_url' in row) updates.asset_url = data.publicUrl;
    if ('public_url' in row) updates.public_url = data.publicUrl;
  }

  return updates;
};

const getAllowedPageFields = (page: CmsRow | null): string[] => {
  if (!page) {
    return BASE_PAGE_FIELDS;
  }

  if (page.plan_family === 'comprehensive' || page.plan_family === 'hospital') {
    return COMPREHENSIVE_OR_HOSPITAL_PAGE_FIELDS;
  }

  if (page.plan_family === 'senior') {
    return SENIOR_PAGE_FIELDS;
  }

  return BASE_PAGE_FIELDS;
};

const filterFields = (fields: string[], allowlist: string[]): string[] => {
  const allowSet = new Set(allowlist);
  return fields.filter((field) => allowSet.has(field));
};

const reorderRowsById = (rows: CmsRow[], draggedId: string, targetId: string): CmsRow[] => {
  if (draggedId === targetId) return rows;

  const draggedIndex = rows.findIndex((row) => row.id === draggedId);
  const targetIndex = rows.findIndex((row) => row.id === targetId);

  if (draggedIndex < 0 || targetIndex < 0) {
    return rows;
  }

  const nextRows = [...rows];
  const [draggedRow] = nextRows.splice(draggedIndex, 1);
  nextRows.splice(targetIndex, 0, draggedRow);
  return nextRows.map((row, index) => ({ ...row, sort_order: index + 1 }));
};

const getFieldLabel = (field: string): string => {
  return PAGE_FIELD_LABELS[field] ?? ROW_FIELD_LABELS[field] ?? humanizeKey(field);
};

const AdminCmsPlaceholderPage: React.FC = () => {
  const { isDark } = useTheme();
  const [pages, setPages] = useState<CmsRow[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [pageDraft, setPageDraft] = useState<CmsRow | null>(null);
  const [pageBaseline, setPageBaseline] = useState<CmsRow | null>(null);
  const [collections, setCollections] = useState<Record<CmsTableKey, CmsRow[]>>(createEmptyCollections());
  const [collectionSnapshots, setCollectionSnapshots] = useState<Record<CmsTableKey, Record<string, CmsRow>>>(createEmptyCollectionSnapshots());
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
  const [savingPage, setSavingPage] = useState(false);
  const [savingRows, setSavingRows] = useState<Record<string, boolean>>({});
  const [uploadingRows, setUploadingRows] = useState<Record<string, boolean>>({});
  const [sidebarQuery, setSidebarQuery] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTabKey>('page');
  const [editStartedAt, setEditStartedAt] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [reportMonth, setReportMonth] = useState(getCurrentMonthInputValue());
  const [generatingReport, setGeneratingReport] = useState(false);
  const [draggedBenefitId, setDraggedBenefitId] = useState<string | null>(null);
  const [draggedCoverHighlightId, setDraggedCoverHighlightId] = useState<string | null>(null);
  const [savingBenefitOrder, setSavingBenefitOrder] = useState(false);
  const [savingCoverHighlightOrder, setSavingCoverHighlightOrder] = useState(false);
  const [savingAllChanges, setSavingAllChanges] = useState(false);
  const [hospitalDayCardSummaries, setHospitalDayCardSummaries] = useState(DEFAULT_HOSPITAL_DAY_CARD_SUMMARIES);
  const [savingHospitalDayCards, setSavingHospitalDayCards] = useState(false);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? null,
    [pages, selectedPageId],
  );
  const pageSessionKey = selectedPageId ? `page:${selectedPageId}` : 'page';

  const groupedPages = useMemo(() => {
    const groups = new Map<string, CmsRow[]>();

    pages.forEach((page) => {
      const familyKey = typeof page.plan_family === 'string' ? page.plan_family : 'other';
      const current = groups.get(familyKey) ?? [];
      current.push(page);
      groups.set(familyKey, current);
    });

    return [...groups.entries()].sort(([left], [right]) => {
      const leftIndex = PLAN_FAMILY_ORDER.indexOf(left);
      const rightIndex = PLAN_FAMILY_ORDER.indexOf(right);

      if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right);
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    });
  }, [pages]);

  const filteredGroupedPages = useMemo(() => {
    const query = sidebarQuery.trim().toLowerCase();

    if (!query) {
      return groupedPages;
    }

    return groupedPages
      .map(([familyKey, familyPages]) => {
        const filteredPages = familyPages.filter((page) => {
          const title = getPageCardTitle(page).toLowerCase();
          const meta = getPageCardMeta(page).join(' ').toLowerCase();
          const family = getPlanFamilyLabel(page).toLowerCase();
          return title.includes(query) || meta.includes(query) || family.includes(query);
        });

        return [familyKey, filteredPages] as const;
      })
      .filter(([, familyPages]) => familyPages.length > 0);
  }, [groupedPages, sidebarQuery]);

  const pageHasUnsavedChanges = useMemo(() => {
    if (!pageDraft) return false;
    const baselinePayload = pageBaseline ? buildUpdatePayload(pageBaseline) : {};
    const payload = buildUpdatePayload(pageDraft);
    return diffRecords(baselinePayload, payload).changedFields.length > 0;
  }, [pageDraft, pageBaseline]);

  const changedCollectionRows = useMemo(() => {
    return TABLE_CONFIG.flatMap((config) =>
      collections[config.key]
        .filter((row) => {
          const previousRow = collectionSnapshots[config.key][row.id] ?? null;
          const previousPayload = previousRow ? buildUpdatePayload(previousRow) : {};
          const payload = buildUpdatePayload(row);
          return diffRecords(previousPayload, payload).changedFields.length > 0;
        })
        .map((row) => ({ collectionKey: config.key, row })),
    );
  }, [collections, collectionSnapshots]);

  const hasUnsavedChanges = pageHasUnsavedChanges || changedCollectionRows.length > 0;
  const isSavingAnyChange =
    savingPage ||
    savingAllChanges ||
    savingBenefitOrder ||
    savingCoverHighlightOrder ||
    Object.values(savingRows).some(Boolean) ||
    Object.values(uploadingRows).some(Boolean);

  const setRowBusy = (key: string, value: boolean, target: 'saving' | 'uploading') => {
    const setter = target === 'saving' ? setSavingRows : setUploadingRows;
    setter((prev) => ({ ...prev, [key]: value }));
  };

  const ensureEditSessionStarted = (key: string) => {
    const nowIso = new Date().toISOString();
    setEditStartedAt((prev) => (prev[key] ? prev : { ...prev, [key]: nowIso }));
    return nowIso;
  };

  const upsertEditSessionStartedAt = (key: string, timestampIso: string) => {
    setEditStartedAt((prev) => ({ ...prev, [key]: timestampIso }));
  };

  const writeAuditLog = async (entry: CmsChangeLogInsert): Promise<string | null> => {
    const { error } = await supabase.from(CMS_CHANGE_LOG_TABLE).insert(entry);
    return error ? error.message : null;
  };

  const fetchLatestRevertableLog = async ({ tableName, recordId, pageId }: AuditLookupParams): Promise<CmsChangeLogRow | null> => {
    let query = supabase
      .from(CMS_CHANGE_LOG_TABLE)
      .select('*')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('completed_at', { ascending: false })
      .limit(20);

    if (pageId) {
      query = query.eq('page_id', pageId);
    }

    if (currentUserId) {
      query = query.eq('changed_by', currentUserId);
    } else if (currentUserEmail) {
      query = query.eq('changed_by_email', currentUserEmail);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `${error.message}. Run docs/cms/phase-4-cms-change-tracking-and-reporting.sql if revert tracking is not enabled yet.`,
      );
    }

    return ((data ?? []) as CmsChangeLogRow[]).find((row) => row.action_type !== 'replace_file') ?? null;
  };

  const fetchLatestAssetFileLog = async ({ recordId, pageId }: { recordId: string; pageId?: string | null }): Promise<CmsChangeLogRow | null> => {
    let query = supabase
      .from(CMS_CHANGE_LOG_TABLE)
      .select('*')
      .eq('table_name', 'cms_plan_assets')
      .eq('record_id', recordId)
      .order('completed_at', { ascending: false })
      .limit(20);

    if (pageId) {
      query = query.eq('page_id', pageId);
    }

    if (currentUserId) {
      query = query.eq('changed_by', currentUserId);
    } else if (currentUserEmail) {
      query = query.eq('changed_by_email', currentUserEmail);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `${error.message}. Run docs/cms/phase-4-cms-change-tracking-and-reporting.sql if revert tracking is not enabled yet.`,
      );
    }

    return ((data ?? []) as CmsChangeLogRow[]).find(
      (auditRow) =>
        (auditRow.action_type === 'replace_file' || auditRow.action_type === 'revert') &&
        typeof toAuditValueRecord(auditRow.previous_values).backup_storage_path === 'string',
    ) ?? null;
  };

  const fetchPages = async () => {
    if (!hasSupabaseEnv) {
      setLoadingPages(false);
      setStatus({ type: 'error', message: supabaseConfigError ?? 'Supabase is not configured.' });
      return;
    }

    try {
      setLoadingPages(true);
      const { data, error } = await supabase
        .from('cms_plan_pages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const nextPages = data ?? [];
      setPages(nextPages);
      setSelectedPageId((current) => {
        if (current && nextPages.some((page) => page.id === current)) {
          return current;
        }
        return nextPages[0]?.id ?? '';
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load CMS pages.';
      setStatus({ type: 'error', message });
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchPageContent = async (pageId: string) => {
    if (!pageId || !hasSupabaseEnv) {
      setPageBaseline(null);
      setCollections(createEmptyCollections());
      setCollectionSnapshots(createEmptyCollectionSnapshots());
      return;
    }

    try {
      setLoadingContent(true);
      setStatus(null);

      const pageRecord = pages.find((page) => page.id === pageId) ?? null;
      setPageDraft(pageRecord ? snapshotRow(pageRecord) : null);
      setPageBaseline(pageRecord ? snapshotRow(pageRecord) : null);

      const results = await Promise.all(
        TABLE_CONFIG.map(async (config) => {
          const { data, error } = await supabase
            .from(config.table)
            .select('*')
            .eq('page_id', pageId)
            .order('sort_order', { ascending: true });

          if (error) throw new Error(`${config.title}: ${error.message}`);
          return [config.key, data ?? []] as const;
        }),
      );

      const nextCollections = createEmptyCollections();
      results.forEach(([key, data]) => {
        nextCollections[key] = data;
      });
      setCollections(nextCollections);
      setCollectionSnapshots({
        benefits: snapshotRows(nextCollections.benefits),
        coverHighlights: snapshotRows(nextCollections.coverHighlights),
        priceRows: snapshotRows(nextCollections.priceRows),
        assets: snapshotRows(nextCollections.assets),
      });
      setEditStartedAt({ [`page:${pageId}`]: new Date().toISOString() });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load CMS content.';
      setStatus({ type: 'error', message });
      setPageBaseline(null);
      setCollections(createEmptyCollections());
      setCollectionSnapshots(createEmptyCollectionSnapshots());
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setCurrentUserId(null);
      setCurrentUserEmail('');
      return;
    }

    const syncCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user?.id ?? null);
      setCurrentUserEmail(user?.email ?? '');
    };

    void syncCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id ?? null);
      setCurrentUserEmail(session?.user?.email ?? '');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedPageId) {
      setPageDraft(null);
      setPageBaseline(null);
      setCollections(createEmptyCollections());
      setCollectionSnapshots(createEmptyCollectionSnapshots());
      setEditStartedAt({});
      return;
    }

    fetchPageContent(selectedPageId);
  }, [selectedPageId, pages]);

  useEffect(() => {
    setActiveEditorTab('page');
  }, [selectedPageId]);

  const handlePageFieldChange = (field: string, value: any) => {
    ensureEditSessionStarted(pageSessionKey);
    setPageDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleRowFieldChange = (collectionKey: CmsTableKey, rowId: string, field: string, value: any) => {
    ensureEditSessionStarted(`${collectionKey}:${rowId}`);
    setCollections((prev) => ({
      ...prev,
      [collectionKey]: prev[collectionKey].map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    }));
  };

  const saveHospitalDayCards = async () => {
    if (!hasSupabaseEnv || savingHospitalDayCards || pages.length === 0) return;

    const startedAt = new Date().toISOString();
    const titleLookup = new Map(HOSPITAL_DAY_CARD_TITLES.map((title) => [title.toLowerCase(), title]));

    try {
      setSavingHospitalDayCards(true);
      setStatus(null);

      const { data, error } = await supabase
        .from('cms_plan_benefits')
        .select('*')
        .in('page_id', pages.map((page) => page.id));

      if (error) throw error;

      const matchingRows = (data ?? []).filter((row) =>
        titleLookup.has(String(row.benefit_title ?? '').trim().toLowerCase()),
      ) as CmsRow[];
      const rowsToUpdate = matchingRows.filter((row) => {
        const title = titleLookup.get(String(row.benefit_title ?? '').trim().toLowerCase());
        return title && String(row.benefit_summary ?? '') !== hospitalDayCardSummaries[title];
      });

      const results = await Promise.all(
        rowsToUpdate.map(async (row) => {
          const title = titleLookup.get(String(row.benefit_title ?? '').trim().toLowerCase())!;
          const nextSummary = hospitalDayCardSummaries[title];
          const { error: updateError } = await supabase
            .from('cms_plan_benefits')
            .update({ benefit_summary: nextSummary })
            .eq('id', row.id);
          if (updateError) throw updateError;

          return { row, nextSummary };
        }),
      );

      const completedAt = new Date().toISOString();
      const auditErrors = await Promise.all(
        results.map(({ row, nextSummary }) =>
          writeAuditLog({
            page_id: String(row.page_id ?? ''),
            plan_family: String(pages.find((page) => page.id === row.page_id)?.plan_family ?? ''),
            plan_key: String(pages.find((page) => page.id === row.page_id)?.plan_key ?? ''),
            page_heading: String(pages.find((page) => page.id === row.page_id)?.page_heading ?? ''),
            section_key: 'benefits',
            action_type: 'update',
            table_name: 'cms_plan_benefits',
            record_id: row.id,
            changed_by: currentUserId,
            changed_by_email: currentUserEmail,
            started_at: startedAt,
            completed_at: completedAt,
            duration_seconds: getDurationSeconds(startedAt, completedAt),
            change_summary: `Bulk updated ${String(row.benefit_title ?? 'hospital day benefit')}`,
            previous_values: buildUpdatePayload(row),
            next_values: { ...buildUpdatePayload(row), benefit_summary: nextSummary },
            changed_fields: ['benefit_summary'],
          }),
        ),
      );

      if (selectedPageId) await fetchPageContent(selectedPageId);
      const auditFailureCount = auditErrors.filter(Boolean).length;
      setStatus({
        type: auditFailureCount > 0 ? 'error' : 'success',
        message:
          rowsToUpdate.length === 0
            ? 'All hospital day cards already match these values.'
            : auditFailureCount > 0
              ? `${rowsToUpdate.length} hospital day cards updated, but ${auditFailureCount} audit logs failed.`
              : `${rowsToUpdate.length} hospital day cards updated across all plan detail pages.`,
      });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update hospital day cards.' });
    } finally {
      setSavingHospitalDayCards(false);
    }
  };

  const saveBenefitOrder = async (nextRows: CmsRow[], previousRows: CmsRow[]) => {
    const previousOrderById = Object.fromEntries(previousRows.map((row) => [row.id, Number(row.sort_order ?? 0)]));
    const changedRows = nextRows.filter((row) => Number(row.sort_order ?? 0) !== previousOrderById[row.id]);

    if (changedRows.length === 0) {
      return;
    }

    try {
      setSavingBenefitOrder(true);
      setStatus(null);

      const startedAt = new Date().toISOString();
      const updates = changedRows.map((row) =>
        supabase.from('cms_plan_benefits').update({ sort_order: row.sort_order }).eq('id', row.id),
      );
      const results = await Promise.all(updates);
      const failedUpdate = results.find((result) => result.error);

      if (failedUpdate?.error) {
        throw failedUpdate.error;
      }

      const completedAt = new Date().toISOString();
      setCollectionSnapshots((prev) => ({
        ...prev,
        benefits: changedRows.reduce(
          (nextSnapshots, row) => ({
            ...nextSnapshots,
            [row.id]: {
              ...(nextSnapshots[row.id] ?? collectionSnapshots.benefits[row.id] ?? row),
              sort_order: row.sort_order,
            },
          }),
          { ...prev.benefits },
        ),
      }));

      const auditResults = await Promise.all(
        changedRows.map((row) =>
          writeAuditLog({
            page_id: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
            plan_family: String(selectedPage?.plan_family ?? ''),
            plan_key: String(selectedPage?.plan_key ?? ''),
            page_heading: String(selectedPage?.page_heading ?? selectedPage?.hero_title ?? ''),
            section_key: 'benefits',
            action_type: 'update',
            table_name: 'cms_plan_benefits',
            record_id: row.id,
            changed_by: currentUserId,
            changed_by_email: currentUserEmail,
            started_at: startedAt,
            completed_at: completedAt,
            duration_seconds: getDurationSeconds(startedAt, completedAt),
            change_summary: `Reordered benefit "${String(row.benefit_title ?? row.id)}"`,
            previous_values: { sort_order: previousOrderById[row.id] },
            next_values: { sort_order: row.sort_order },
            changed_fields: ['sort_order'],
          }),
        ),
      );

      const auditError = auditResults.find(Boolean);
      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError
          ? `Benefit order saved, but tracking log failed: ${auditError}`
          : 'Benefit order saved. Plan detail pages will use this order.',
      });
    } catch (err) {
      setCollections((prev) => ({ ...prev, benefits: previousRows }));
      const message = err instanceof Error ? err.message : 'Failed to save benefit order.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingBenefitOrder(false);
    }
  };

  const saveCoverHighlightOrder = async (nextRows: CmsRow[], previousRows: CmsRow[]) => {
    const previousOrderById = Object.fromEntries(previousRows.map((row) => [row.id, Number(row.sort_order ?? 0)]));
    const changedRows = nextRows.filter((row) => Number(row.sort_order ?? 0) !== previousOrderById[row.id]);

    if (changedRows.length === 0) {
      return;
    }

    try {
      setSavingCoverHighlightOrder(true);
      setStatus(null);

      const startedAt = new Date().toISOString();
      const updates = changedRows.map((row) =>
        supabase.from('cms_plan_cover_highlights').update({ sort_order: row.sort_order }).eq('id', row.id),
      );
      const results = await Promise.all(updates);
      const failedUpdate = results.find((result) => result.error);

      if (failedUpdate?.error) {
        throw failedUpdate.error;
      }

      const completedAt = new Date().toISOString();
      setCollectionSnapshots((prev) => ({
        ...prev,
        coverHighlights: changedRows.reduce(
          (nextSnapshots, row) => ({
            ...nextSnapshots,
            [row.id]: {
              ...(nextSnapshots[row.id] ?? collectionSnapshots.coverHighlights[row.id] ?? row),
              sort_order: row.sort_order,
            },
          }),
          { ...prev.coverHighlights },
        ),
      }));

      const auditResults = await Promise.all(
        changedRows.map((row) =>
          writeAuditLog({
            page_id: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
            plan_family: String(selectedPage?.plan_family ?? ''),
            plan_key: String(selectedPage?.plan_key ?? ''),
            page_heading: String(selectedPage?.page_heading ?? selectedPage?.hero_title ?? ''),
            section_key: 'coverHighlights',
            action_type: 'update',
            table_name: 'cms_plan_cover_highlights',
            record_id: row.id,
            changed_by: currentUserId,
            changed_by_email: currentUserEmail,
            started_at: startedAt,
            completed_at: completedAt,
            duration_seconds: getDurationSeconds(startedAt, completedAt),
            change_summary: `Reordered cover highlight "${String(row.highlight_text ?? row.id)}"`,
            previous_values: { sort_order: previousOrderById[row.id] },
            next_values: { sort_order: row.sort_order },
            changed_fields: ['sort_order'],
          }),
        ),
      );

      const auditError = auditResults.find(Boolean);
      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError
          ? `Cover highlight order saved, but tracking log failed: ${auditError}`
          : 'Cover highlight order saved. Plan detail pages will use this order.',
      });
    } catch (err) {
      setCollections((prev) => ({ ...prev, coverHighlights: previousRows }));
      const message = err instanceof Error ? err.message : 'Failed to save cover highlight order.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingCoverHighlightOrder(false);
    }
  };

  const addBenefit = async () => {
    if (!selectedPage || savingAllChanges || savingBenefitOrder) {
      return;
    }

    const startedAt = new Date().toISOString();
    const nextSortOrder =
      collections.benefits.reduce((maxOrder, row) => Math.max(maxOrder, Number(row.sort_order ?? 0)), 0) + 1;
    const newBenefit: CmsRow = {
      id: crypto.randomUUID(),
      page_id: selectedPage.id,
      sort_order: nextSortOrder,
      benefit_title: 'New Benefit',
      benefit_summary: '',
    };

    try {
      setSavingAllChanges(true);
      setStatus(null);

      const { data, error } = await supabase
        .from('cms_plan_benefits')
        .insert(newBenefit)
        .select('*')
        .single();

      if (error) throw error;

      const insertedBenefit = (data ?? newBenefit) as CmsRow;
      setCollections((prev) => ({
        ...prev,
        benefits: [...prev.benefits, insertedBenefit].sort((left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0)),
      }));
      setCollectionSnapshots((prev) => ({
        ...prev,
        benefits: {
          ...prev.benefits,
          [insertedBenefit.id]: snapshotRow(insertedBenefit),
        },
      }));
      upsertEditSessionStartedAt(`benefits:${insertedBenefit.id}`, new Date().toISOString());

      const completedAt = new Date().toISOString();
      const auditError = await writeAuditLog({
        page_id: selectedPage.id,
        plan_family: String(selectedPage.plan_family ?? ''),
        plan_key: String(selectedPage.plan_key ?? ''),
        page_heading: String(selectedPage.page_heading ?? selectedPage.hero_title ?? ''),
        section_key: 'benefits',
        action_type: 'create',
        table_name: 'cms_plan_benefits',
        record_id: insertedBenefit.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: startedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(startedAt, completedAt),
        change_summary: `Created benefit "${String(insertedBenefit.benefit_title ?? insertedBenefit.id)}"`,
        previous_values: {},
        next_values: buildUpdatePayload(insertedBenefit),
        changed_fields: Object.keys(buildUpdatePayload(insertedBenefit)),
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `Benefit added, but tracking log failed: ${auditError}` : 'Benefit added. Add the description, then use Save Changes.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add benefit.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingAllChanges(false);
    }
  };

  const deleteBenefit = async (row: CmsRow) => {
    if (savingAllChanges || savingBenefitOrder) {
      return;
    }

    const title = String(row.benefit_title ?? 'this benefit');
    const confirmed = window.confirm(`Delete "${title}" from this plan? This cannot be undone from the CMS screen.`);
    if (!confirmed) {
      return;
    }

    const previousRows = collections.benefits;
    const remainingRows = previousRows
      .filter((benefit) => benefit.id !== row.id)
      .map((benefit, index) => ({ ...benefit, sort_order: index + 1 }));
    const startedAt = new Date().toISOString();

    try {
      setSavingAllChanges(true);
      setStatus(null);

      const { error } = await supabase.from('cms_plan_benefits').delete().eq('id', row.id);
      if (error) throw error;

      const orderUpdates = remainingRows
        .filter((benefit) => Number(benefit.sort_order ?? 0) !== Number(previousRows.find((previous) => previous.id === benefit.id)?.sort_order ?? 0))
        .map((benefit) => supabase.from('cms_plan_benefits').update({ sort_order: benefit.sort_order }).eq('id', benefit.id));
      const orderResults = await Promise.all(orderUpdates);
      const failedOrderUpdate = orderResults.find((result) => result.error);
      if (failedOrderUpdate?.error) {
        throw failedOrderUpdate.error;
      }

      setCollections((prev) => ({ ...prev, benefits: remainingRows }));
      setCollectionSnapshots((prev) => {
        const nextSnapshots = { ...prev.benefits };
        delete nextSnapshots[row.id];
        remainingRows.forEach((benefit) => {
          nextSnapshots[benefit.id] = snapshotRow(benefit);
        });
        return { ...prev, benefits: nextSnapshots };
      });

      const completedAt = new Date().toISOString();
      const auditError = await writeAuditLog({
        page_id: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
        plan_family: String(selectedPage?.plan_family ?? ''),
        plan_key: String(selectedPage?.plan_key ?? ''),
        page_heading: String(selectedPage?.page_heading ?? selectedPage?.hero_title ?? ''),
        section_key: 'benefits',
        action_type: 'delete',
        table_name: 'cms_plan_benefits',
        record_id: row.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: startedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(startedAt, completedAt),
        change_summary: `Deleted benefit "${title}"`,
        previous_values: buildUpdatePayload(row),
        next_values: {},
        changed_fields: Object.keys(buildUpdatePayload(row)),
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `Benefit deleted, but tracking log failed: ${auditError}` : 'Benefit deleted.',
      });
    } catch (err) {
      setCollections((prev) => ({ ...prev, benefits: previousRows }));
      const message = err instanceof Error ? err.message : 'Failed to delete benefit.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingAllChanges(false);
    }
  };

  const addCoverHighlight = async () => {
    if (!selectedPage || savingAllChanges || savingCoverHighlightOrder) {
      return;
    }

    const startedAt = new Date().toISOString();
    const nextSortOrder =
      collections.coverHighlights.reduce((maxOrder, row) => Math.max(maxOrder, Number(row.sort_order ?? 0)), 0) + 1;
    const newCoverHighlight: CmsRow = {
      id: crypto.randomUUID(),
      page_id: selectedPage.id,
      sort_order: nextSortOrder,
      highlight_text: 'New Cover Highlight',
    };

    try {
      setSavingAllChanges(true);
      setStatus(null);

      const { data, error } = await supabase
        .from('cms_plan_cover_highlights')
        .insert(newCoverHighlight)
        .select('*')
        .single();

      if (error) throw error;

      const insertedCoverHighlight = (data ?? newCoverHighlight) as CmsRow;
      setCollections((prev) => ({
        ...prev,
        coverHighlights: [...prev.coverHighlights, insertedCoverHighlight].sort(
          (left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0),
        ),
      }));
      setCollectionSnapshots((prev) => ({
        ...prev,
        coverHighlights: {
          ...prev.coverHighlights,
          [insertedCoverHighlight.id]: snapshotRow(insertedCoverHighlight),
        },
      }));
      upsertEditSessionStartedAt(`coverHighlights:${insertedCoverHighlight.id}`, new Date().toISOString());

      const completedAt = new Date().toISOString();
      const auditError = await writeAuditLog({
        page_id: selectedPage.id,
        plan_family: String(selectedPage.plan_family ?? ''),
        plan_key: String(selectedPage.plan_key ?? ''),
        page_heading: String(selectedPage.page_heading ?? selectedPage.hero_title ?? ''),
        section_key: 'coverHighlights',
        action_type: 'create',
        table_name: 'cms_plan_cover_highlights',
        record_id: insertedCoverHighlight.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: startedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(startedAt, completedAt),
        change_summary: `Created cover highlight "${String(insertedCoverHighlight.highlight_text ?? insertedCoverHighlight.id)}"`,
        previous_values: {},
        next_values: buildUpdatePayload(insertedCoverHighlight),
        changed_fields: Object.keys(buildUpdatePayload(insertedCoverHighlight)),
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `Cover highlight added, but tracking log failed: ${auditError}` : 'Cover highlight added. Update the text, then use Save Changes.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add cover highlight.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingAllChanges(false);
    }
  };

  const deleteCoverHighlight = async (row: CmsRow) => {
    if (savingAllChanges || savingCoverHighlightOrder) {
      return;
    }

    const title = String(row.highlight_text ?? 'this cover highlight');
    const confirmed = window.confirm(`Delete "${title}" from this plan? This cannot be undone from the CMS screen.`);
    if (!confirmed) {
      return;
    }

    const previousRows = collections.coverHighlights;
    const remainingRows = previousRows
      .filter((highlight) => highlight.id !== row.id)
      .map((highlight, index) => ({ ...highlight, sort_order: index + 1 }));
    const startedAt = new Date().toISOString();

    try {
      setSavingAllChanges(true);
      setStatus(null);

      const { error } = await supabase.from('cms_plan_cover_highlights').delete().eq('id', row.id);
      if (error) throw error;

      const orderUpdates = remainingRows
        .filter((highlight) => Number(highlight.sort_order ?? 0) !== Number(previousRows.find((previous) => previous.id === highlight.id)?.sort_order ?? 0))
        .map((highlight) => supabase.from('cms_plan_cover_highlights').update({ sort_order: highlight.sort_order }).eq('id', highlight.id));
      const orderResults = await Promise.all(orderUpdates);
      const failedOrderUpdate = orderResults.find((result) => result.error);
      if (failedOrderUpdate?.error) {
        throw failedOrderUpdate.error;
      }

      setCollections((prev) => ({ ...prev, coverHighlights: remainingRows }));
      setCollectionSnapshots((prev) => {
        const nextSnapshots = { ...prev.coverHighlights };
        delete nextSnapshots[row.id];
        remainingRows.forEach((highlight) => {
          nextSnapshots[highlight.id] = snapshotRow(highlight);
        });
        return { ...prev, coverHighlights: nextSnapshots };
      });

      const completedAt = new Date().toISOString();
      const auditError = await writeAuditLog({
        page_id: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
        plan_family: String(selectedPage?.plan_family ?? ''),
        plan_key: String(selectedPage?.plan_key ?? ''),
        page_heading: String(selectedPage?.page_heading ?? selectedPage?.hero_title ?? ''),
        section_key: 'coverHighlights',
        action_type: 'delete',
        table_name: 'cms_plan_cover_highlights',
        record_id: row.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: startedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(startedAt, completedAt),
        change_summary: `Deleted cover highlight "${title}"`,
        previous_values: buildUpdatePayload(row),
        next_values: {},
        changed_fields: Object.keys(buildUpdatePayload(row)),
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `Cover highlight deleted, but tracking log failed: ${auditError}` : 'Cover highlight deleted.',
      });
    } catch (err) {
      setCollections((prev) => ({ ...prev, coverHighlights: previousRows }));
      const message = err instanceof Error ? err.message : 'Failed to delete cover highlight.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingAllChanges(false);
    }
  };

  const handleBenefitDrop = (targetRowId: string) => {
    if (!draggedBenefitId || draggedBenefitId === targetRowId || savingBenefitOrder) {
      setDraggedBenefitId(null);
      return;
    }

    const previousRows = collections.benefits;
    const nextRows = reorderRowsById(previousRows, draggedBenefitId, targetRowId);
    setDraggedBenefitId(null);
    setCollections((prev) => ({ ...prev, benefits: nextRows }));
    void saveBenefitOrder(nextRows, previousRows);
  };

  const handleCoverHighlightDrop = (targetRowId: string) => {
    if (!draggedCoverHighlightId || draggedCoverHighlightId === targetRowId || savingCoverHighlightOrder) {
      setDraggedCoverHighlightId(null);
      return;
    }

    const previousRows = collections.coverHighlights;
    const nextRows = reorderRowsById(previousRows, draggedCoverHighlightId, targetRowId);
    setDraggedCoverHighlightId(null);
    setCollections((prev) => ({ ...prev, coverHighlights: nextRows }));
    void saveCoverHighlightOrder(nextRows, previousRows);
  };

  const savePage = async () => {
    if (!pageDraft) return;

    const baselinePayload = pageBaseline ? buildUpdatePayload(pageBaseline) : {};
    const payload = buildUpdatePayload(pageDraft);
    const diff = diffRecords(baselinePayload, payload);

    if (diff.changedFields.length === 0) {
      setStatus({ type: 'success', message: 'No page changes to save.' });
      return;
    }

    try {
      setSavingPage(true);
      setStatus(null);
      const { error } = await supabase.from('cms_plan_pages').update(payload).eq('id', pageDraft.id);
      if (error) throw error;

      setPages((prev) => prev.map((page) => (page.id === pageDraft.id ? { ...page, ...payload } : page)));
      setPageBaseline(snapshotRow(pageDraft));
      const completedAt = new Date().toISOString();
      upsertEditSessionStartedAt(pageSessionKey, completedAt);

      const auditError = await writeAuditLog({
        page_id: pageDraft.id,
        plan_family: String(pageDraft.plan_family ?? ''),
        plan_key: String(pageDraft.plan_key ?? ''),
        page_heading: String(pageDraft.page_heading ?? ''),
        section_key: 'page',
        action_type: 'update',
        table_name: 'cms_plan_pages',
        record_id: pageDraft.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: editStartedAt[pageSessionKey] ?? completedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(editStartedAt[pageSessionKey], completedAt),
        change_summary: buildAuditSummary('page', diff.changedFields, 'update', getPageCardTitle(pageDraft)),
        previous_values: diff.previousValues,
        next_values: diff.nextValues,
        changed_fields: diff.changedFields,
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `Page details saved, but tracking log failed: ${auditError}` : 'Page details saved.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save page details.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingPage(false);
    }
  };

  const saveAllChanges = async () => {
    if (!hasUnsavedChanges || isSavingAnyChange) {
      return;
    }

    try {
      setSavingAllChanges(true);
      setStatus(null);

      const pageNeedsSave = pageHasUnsavedChanges;
      const rowsToSave = changedCollectionRows;

      if (pageNeedsSave) {
        await savePage();
      }

      for (const { collectionKey, row } of rowsToSave) {
        await saveRow(collectionKey, row, {
          successMessage: 'Changes saved.',
        });
      }

      setStatus({
        type: 'success',
        message: `Saved ${Number(pageNeedsSave) + rowsToSave.length} change${Number(pageNeedsSave) + rowsToSave.length === 1 ? '' : 's'}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save CMS changes.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingAllChanges(false);
    }
  };

  const revertPage = async () => {
    if (!pageDraft) return;

    try {
      setSavingPage(true);
      setStatus(null);

      const latestLog = await fetchLatestRevertableLog({
        tableName: 'cms_plan_pages',
        recordId: pageDraft.id,
        pageId: pageDraft.id,
      });

      if (!latestLog) {
        setStatus({ type: 'error', message: 'No saved page changes were found to revert for this page.' });
        return;
      }

      const previousValues = toAuditValueRecord(latestLog.previous_values);
      if (Object.keys(previousValues).length === 0) {
        setStatus({ type: 'error', message: 'The latest saved page change does not contain revertable field values.' });
        return;
      }

      const revertedPage = { ...pageDraft, ...previousValues };
      const currentPayload = buildUpdatePayload(pageDraft);
      const payload = buildUpdatePayload(revertedPage);
      const diff = diffRecords(currentPayload, payload);

      if (diff.changedFields.length === 0) {
        setStatus({ type: 'success', message: 'The latest saved page change is already reverted.' });
        return;
      }

      const startedAt = new Date().toISOString();
      const { error } = await supabase.from('cms_plan_pages').update(payload).eq('id', pageDraft.id);
      if (error) throw error;

      setPages((prev) => prev.map((page) => (page.id === pageDraft.id ? { ...page, ...payload } : page)));
      setPageDraft(snapshotRow(revertedPage));
      setPageBaseline(snapshotRow(revertedPage));

      const completedAt = new Date().toISOString();
      upsertEditSessionStartedAt(pageSessionKey, completedAt);

      const auditError = await writeAuditLog({
        page_id: pageDraft.id,
        plan_family: String(revertedPage.plan_family ?? ''),
        plan_key: String(revertedPage.plan_key ?? ''),
        page_heading: String(revertedPage.page_heading ?? ''),
        section_key: 'page',
        action_type: 'revert',
        table_name: 'cms_plan_pages',
        record_id: pageDraft.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: startedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(startedAt, completedAt),
        change_summary: buildAuditSummary('page', diff.changedFields, 'revert', getPageCardTitle(revertedPage)),
        previous_values: diff.previousValues,
        next_values: diff.nextValues,
        changed_fields: diff.changedFields,
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `Page reverted, but tracking log failed: ${auditError}` : 'Latest saved page change reverted.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to revert the latest saved page change.';
      setStatus({ type: 'error', message });
    } finally {
      setSavingPage(false);
    }
  };

  const saveRow = async (collectionKey: CmsTableKey, row: CmsRow, options?: SaveRowOptions) => {
    const config = TABLE_CONFIG.find((entry) => entry.key === collectionKey);
    if (!config) return;

    const busyKey = `${collectionKey}:${row.id}`;
    const previousRow = options?.previousRow ?? collectionSnapshots[collectionKey][row.id] ?? null;
    const previousPayload = previousRow ? buildUpdatePayload(previousRow) : {};
    const payload = buildUpdatePayload(row);
    const diff = diffRecords(previousPayload, payload);
    const mergedPreviousValues = { ...diff.previousValues, ...(options?.auditPreviousValues ?? {}) };
    const mergedNextValues = { ...diff.nextValues, ...(options?.auditNextValues ?? {}) };
    const mergedChangedFields = Array.from(
      new Set([
        ...diff.changedFields,
        ...Object.keys(options?.auditPreviousValues ?? {}),
        ...Object.keys(options?.auditNextValues ?? {}),
        ...(options?.auditChangedFields ?? []),
      ]),
    );

    if (mergedChangedFields.length === 0 && !options?.allowSaveWithoutFieldDiff) {
      setStatus({ type: 'success', message: `No ${config.title.toLowerCase()} changes to save.` });
      return;
    }

    try {
      setRowBusy(busyKey, true, 'saving');
      setStatus(null);
      const { error } = await supabase.from(config.table).update(payload).eq('id', row.id);
      if (error) throw error;

      const completedAt = new Date().toISOString();
      setCollectionSnapshots((prev) => ({
        ...prev,
        [collectionKey]: {
          ...prev[collectionKey],
          [row.id]: snapshotRow(row),
        },
      }));
      upsertEditSessionStartedAt(busyKey, completedAt);

      const auditError = await writeAuditLog({
        page_id: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
        plan_family: String(selectedPage?.plan_family ?? ''),
        plan_key: String(selectedPage?.plan_key ?? ''),
        page_heading: String(selectedPage?.page_heading ?? selectedPage?.hero_title ?? ''),
        section_key: collectionKey,
        action_type: options?.actionType ?? 'update',
        table_name: config.table,
        record_id: row.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: options?.startedAt ?? editStartedAt[busyKey] ?? completedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(options?.startedAt ?? editStartedAt[busyKey], completedAt),
        change_summary:
          options?.changeSummary ??
          buildAuditSummary(collectionKey, mergedChangedFields, options?.actionType ?? 'update', getPageCardTitle(selectedPage ?? row)),
        previous_values: mergedPreviousValues,
        next_values: mergedNextValues,
        changed_fields: mergedChangedFields,
        file_name_before: options?.fileNameBefore ?? (typeof previousRow?.file_name === 'string' ? previousRow.file_name : null),
        file_name_after: options?.fileNameAfter ?? (typeof row.file_name === 'string' ? row.file_name : null),
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `${config.title} row saved, but tracking log failed: ${auditError}` : options?.successMessage ?? `${config.title} row saved.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to save ${config.title.toLowerCase()} row.`;
      setStatus({ type: 'error', message });
    } finally {
      setRowBusy(busyKey, false, 'saving');
    }
  };

  const revertRow = async (collectionKey: CmsTableKey, row: CmsRow) => {
    const config = TABLE_CONFIG.find((entry) => entry.key === collectionKey);
    if (!config) return;

    if (collectionKey === 'assets') {
      const busyKey = `${collectionKey}:${row.id}`;

      try {
        setRowBusy(busyKey, true, 'saving');
        setStatus(null);

        const latestLog = await fetchLatestAssetFileLog({
          recordId: row.id,
          pageId: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
        });

        if (!latestLog) {
          setStatus({ type: 'error', message: 'No saved file replacements were found to revert for this asset.' });
          return;
        }

        const latestPreviousValues = toAuditValueRecord(latestLog.previous_values);
        const backupStoragePath = getStringValue(latestPreviousValues.backup_storage_path);
        if (!backupStoragePath) {
          setStatus({ type: 'error', message: 'The latest saved file replacement does not contain a backup copy to restore.' });
          return;
        }

        const activeStoragePath =
          resolveAssetStoragePath(row) ??
          getStringValue(toAuditValueRecord(latestLog.next_values).storage_path) ??
          getStringValue(latestPreviousValues.storage_path);

        if (!activeStoragePath) {
          setStatus({ type: 'error', message: 'This asset does not have a valid storage path to restore into.' });
          return;
        }

        const currentStoragePath = resolveAssetStoragePath(row);
        const currentBackupPath = currentStoragePath ? buildAssetVersionPath(currentStoragePath, row) : null;

        if (currentStoragePath && currentBackupPath) {
          const { error: backupCurrentError } = await supabase.storage.from(PLAN_DOCS_BUCKET).copy(currentStoragePath, currentBackupPath);
          if (backupCurrentError) {
            throw new Error(`Could not back up the current file before revert: ${backupCurrentError.message}`);
          }
        }

        const { data: backupBlob, error: downloadBackupError } = await supabase.storage.from(PLAN_DOCS_BUCKET).download(backupStoragePath);
        if (downloadBackupError || !backupBlob) {
          throw new Error(`Could not download the previous file backup: ${downloadBackupError?.message ?? 'Unknown error'}`);
        }

        const { error: restoreError } = await supabase.storage.from(PLAN_DOCS_BUCKET).upload(activeStoragePath, backupBlob, { upsert: true });
        if (restoreError) {
          throw new Error(`Could not restore the previous file: ${restoreError.message}`);
        }

        const restoredFileName =
          getStringValue(latestPreviousValues.file_name) ??
          getStringValue(row.file_name) ??
          getStringValue(latestLog.file_name_before) ??
          'restored-file';

        const updates = buildAssetRowUpdates(row, activeStoragePath, restoredFileName);
        const revertedAssetRow = { ...row, ...updates };

        setCollections((prev) => ({
          ...prev,
          assets: prev.assets.map((entry) => (entry.id === row.id ? revertedAssetRow : entry)),
        }));

        await saveRow('assets', revertedAssetRow, {
          actionType: 'revert',
          previousRow: row,
          startedAt: new Date().toISOString(),
          changeSummary: `Restored ${String(row.asset_label ?? row.asset_type ?? 'asset')} to ${restoredFileName}`,
          fileNameBefore: getStringValue(row.file_name),
          fileNameAfter: restoredFileName,
          auditPreviousValues: {
            backup_storage_path: currentBackupPath,
            restored_from_backup_path: backupStoragePath,
          },
          auditNextValues: {
            restored_to_storage_path: activeStoragePath,
          },
          auditChangedFields: ['backup_storage_path', 'restored_from_backup_path', 'restored_to_storage_path', 'file_content'],
          allowSaveWithoutFieldDiff: true,
          successMessage: 'Latest saved file replacement reverted.',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to revert the latest saved file replacement.';
        setStatus({ type: 'error', message });
      } finally {
        setRowBusy(busyKey, false, 'saving');
      }

      return;
    }

    const busyKey = `${collectionKey}:${row.id}`;

    try {
      setRowBusy(busyKey, true, 'saving');
      setStatus(null);

      const latestLog = await fetchLatestRevertableLog({
        tableName: config.table,
        recordId: row.id,
        pageId: typeof row.page_id === 'string' && row.page_id.length > 0 ? row.page_id : selectedPage?.id ?? null,
      });

      if (!latestLog) {
        setStatus({ type: 'error', message: `No saved ${config.title.toLowerCase()} changes were found to revert for this row.` });
        return;
      }

      const previousValues = toAuditValueRecord(latestLog.previous_values);
      if (Object.keys(previousValues).length === 0) {
        setStatus({ type: 'error', message: `The latest saved ${config.title.toLowerCase()} change does not contain revertable field values.` });
        return;
      }

      const revertedRow = { ...row, ...previousValues };
      const currentPayload = buildUpdatePayload(row);
      const payload = buildUpdatePayload(revertedRow);
      const diff = diffRecords(currentPayload, payload);

      if (diff.changedFields.length === 0) {
        setStatus({ type: 'success', message: `The latest saved ${config.title.toLowerCase()} change is already reverted.` });
        return;
      }

      const startedAt = new Date().toISOString();
      const { error } = await supabase.from(config.table).update(payload).eq('id', row.id);
      if (error) throw error;

      setCollections((prev) => ({
        ...prev,
        [collectionKey]: prev[collectionKey].map((entry) => (entry.id === row.id ? revertedRow : entry)),
      }));
      setCollectionSnapshots((prev) => ({
        ...prev,
        [collectionKey]: {
          ...prev[collectionKey],
          [row.id]: snapshotRow(revertedRow),
        },
      }));

      const completedAt = new Date().toISOString();
      upsertEditSessionStartedAt(busyKey, completedAt);

      const auditError = await writeAuditLog({
        page_id: typeof revertedRow.page_id === 'string' && revertedRow.page_id.length > 0 ? revertedRow.page_id : selectedPage?.id ?? null,
        plan_family: String(selectedPage?.plan_family ?? ''),
        plan_key: String(selectedPage?.plan_key ?? ''),
        page_heading: String(selectedPage?.page_heading ?? selectedPage?.hero_title ?? ''),
        section_key: collectionKey,
        action_type: 'revert',
        table_name: config.table,
        record_id: row.id,
        changed_by: currentUserId,
        changed_by_email: currentUserEmail,
        started_at: startedAt,
        completed_at: completedAt,
        duration_seconds: getDurationSeconds(startedAt, completedAt),
        change_summary: buildAuditSummary(collectionKey, diff.changedFields, 'revert', getPageCardTitle(selectedPage ?? revertedRow)),
        previous_values: diff.previousValues,
        next_values: diff.nextValues,
        changed_fields: diff.changedFields,
      });

      setStatus({
        type: auditError ? 'error' : 'success',
        message: auditError ? `${config.title} row reverted, but tracking log failed: ${auditError}` : `Latest saved ${config.title.toLowerCase()} change reverted.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to revert the latest saved ${config.title.toLowerCase()} change.`;
      setStatus({ type: 'error', message });
    } finally {
      setRowBusy(busyKey, false, 'saving');
    }
  };

  const handleAssetUpload = async (row: CmsRow, file: File | null) => {
    if (!file || !selectedPage) return;

    const busyKey = `assets:${row.id}`;
    const previousRow = collectionSnapshots.assets[row.id] ?? row;
    const sessionStartedAt = editStartedAt[busyKey] ?? ensureEditSessionStarted(busyKey);

    try {
      setRowBusy(busyKey, true, 'uploading');
      setStatus(null);

      const storagePath = buildAssetPath(selectedPage, row, file);
      const previousStoragePath = resolveAssetStoragePath(previousRow);
      const backupStoragePath = previousStoragePath ? buildAssetVersionPath(previousStoragePath, previousRow) : null;

      if (previousStoragePath && backupStoragePath) {
        const { error: copyError } = await supabase.storage.from(PLAN_DOCS_BUCKET).copy(previousStoragePath, backupStoragePath);
        if (copyError) {
          throw new Error(`Could not create a rollback copy before replacing this file: ${copyError.message}`);
        }
      }

      const { error: uploadError } = await supabase.storage.from(PLAN_DOCS_BUCKET).upload(storagePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const updates = buildAssetRowUpdates(row, storagePath, file.name);
      const nextRow = { ...row, ...updates };
      setCollections((prev) => ({
        ...prev,
        assets: prev.assets.map((asset) => (asset.id === row.id ? nextRow : asset)),
      }));

      if (Object.keys(updates).length > 0 || backupStoragePath) {
        await saveRow('assets', nextRow, {
          actionType: 'replace_file',
          previousRow,
          startedAt: sessionStartedAt,
          changeSummary: `Replaced ${String(row.asset_label ?? row.asset_type ?? 'asset')} with ${file.name}`,
          fileNameBefore: typeof previousRow.file_name === 'string' ? previousRow.file_name : null,
          fileNameAfter: file.name,
          auditPreviousValues: backupStoragePath
            ? {
                backup_storage_path: backupStoragePath,
                replaced_storage_path: previousStoragePath,
              }
            : undefined,
          auditNextValues: {
            uploaded_storage_path: storagePath,
          },
          auditChangedFields: ['file_content', 'uploaded_storage_path'],
          allowSaveWithoutFieldDiff: true,
          successMessage: 'Asset file replaced.',
        });
      } else {
        setStatus({ type: 'success', message: 'File uploaded to storage.' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload asset.';
      setStatus({ type: 'error', message });
    } finally {
      setRowBusy(busyKey, false, 'uploading');
    }
  };

  const handleDownloadMonthlyReport = async () => {
    if (!hasSupabaseEnv) {
      setStatus({ type: 'error', message: 'Supabase is not configured.' });
      return;
    }

    try {
      setGeneratingReport(true);
      setStatus(null);

      const range = monthInputToRange(reportMonth);
      const { data, error } = await supabase
        .from(CMS_CHANGE_LOG_TABLE)
        .select('*')
        .gte('completed_at', range.startIso)
        .lt('completed_at', range.endIso)
        .order('completed_at', { ascending: true });

      if (error) {
        throw new Error(`${error.message}. Run docs/cms/phase-4-cms-change-tracking-and-reporting.sql if the tracking table does not exist yet.`);
      }

      const rows = (data ?? []) as CmsChangeLogRow[];
      if (rows.length === 0) {
        setStatus({ type: 'error', message: `No CMS changes were logged for ${range.label}.` });
        return;
      }

      await downloadMonthlyDocxReport({
        monthLabel: range.label,
        fileStamp: range.fileStamp,
        generatedBy: currentUserEmail || 'Day1 Health CMS',
        rows,
      });

      const totalDurationSeconds = rows.reduce((sum, row) => sum + Number(row.duration_seconds ?? 0), 0);
      setStatus({
        type: 'success',
        message: `Monthly DOCX report downloaded for ${range.label}. ${rows.length} changes included, tracked time ${formatDuration(totalDurationSeconds)}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate the monthly DOCX report.';
      setStatus({ type: 'error', message });
    } finally {
      setGeneratingReport(false);
    }
  };

  const renderFieldEditor = (
    row: CmsRow,
    field: string,
    onChange: (field: string, value: any) => void,
  ) => {
    const value = row[field];
    const inputId = `${row.id}-${field}`;
    const fieldLabel = getFieldLabel(field);

    if (typeof value === 'boolean') {
      return (
        <label htmlFor={inputId} className="inline-flex items-center gap-3">
          <input
            id={inputId}
            type="checkbox"
            checked={value}
            onChange={(event) => onChange(field, event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{fieldLabel}</span>
        </label>
      );
    }

    const commonClasses = `w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
      isDark ? 'border-gray-700 bg-gray-900 text-white placeholder-gray-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
    }`;

    const normalizedValue = value ?? '';
    const isNumeric = typeof value === 'number';

    if (isLongTextField(field, normalizedValue)) {
      return (
        <div>
          <label htmlFor={inputId} className={`mb-2 block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {fieldLabel}
          </label>
          <textarea
            id={inputId}
            value={String(normalizedValue)}
            onChange={(event) => onChange(field, event.target.value)}
            rows={4}
            className={commonClasses}
          />
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={inputId} className={`mb-2 block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {fieldLabel}
        </label>
        <input
          id={inputId}
          type={isNumeric ? 'number' : 'text'}
          value={String(normalizedValue)}
          onChange={(event) => onChange(field, isNumeric ? Number(event.target.value) : event.target.value)}
          className={commonClasses}
        />
      </div>
    );
  };

  const renderRowCard = (collectionKey: CmsTableKey, row: CmsRow) => {
    const busyKey = `${collectionKey}:${row.id}`;
    const isSaving = Boolean(savingRows[busyKey]);
    const isUploading = Boolean(uploadingRows[busyKey]);
    const editableFields = filterFields(sortEditableFields(row), TAB_FIELD_ALLOWLIST[collectionKey]);
    const assetUrl = typeof row.asset_url === 'string' && row.asset_url ? row.asset_url : typeof row.public_url === 'string' && row.public_url ? row.public_url : null;
    const isBenefitRow = collectionKey === 'benefits';
    const isCoverHighlightRow = collectionKey === 'coverHighlights';
    const isOrderableRow = isBenefitRow || isCoverHighlightRow;
    const isOrderSaving = isBenefitRow ? savingBenefitOrder : isCoverHighlightRow ? savingCoverHighlightOrder : false;
    const isDragging = (isBenefitRow && draggedBenefitId === row.id) || (isCoverHighlightRow && draggedCoverHighlightId === row.id);
    const reorderLabel = isBenefitRow ? 'benefit' : 'cover highlight';
    const startRowDrag = (event: React.DragEvent<HTMLElement>) => {
      if (!isOrderableRow || isOrderSaving) return;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', row.id);
      if (isBenefitRow) {
        setDraggedBenefitId(row.id);
      } else {
        setDraggedCoverHighlightId(row.id);
      }
    };
    const endRowDrag = () => {
      setDraggedBenefitId(null);
      setDraggedCoverHighlightId(null);
    };

    return (
      <div
        key={row.id}
        onDragOver={(event) => {
          if (!isOrderableRow || isOrderSaving) return;
          event.preventDefault();
        }}
        onDrop={() => {
          if (isBenefitRow) {
            handleBenefitDrop(row.id);
          } else if (isCoverHighlightRow) {
            handleCoverHighlightDrop(row.id);
          }
        }}
        className={`rounded-2xl border p-5 shadow-sm transition ${
          isDragging
            ? isDark
              ? 'border-emerald-400 bg-emerald-950/40 opacity-70'
              : 'border-emerald-500 bg-emerald-50 opacity-70'
            : isDark
              ? 'border-gray-800 bg-gray-800/60'
              : 'border-gray-200 bg-white'
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {isOrderableRow && (
              <div
                draggable={!isOrderSaving}
                onDragStart={startRowDrag}
                onDragEnd={endRowDrag}
                title={`Drag to reorder ${reorderLabel}`}
                aria-label={`Drag ${String(row.benefit_title ?? row.highlight_text ?? reorderLabel)} to reorder`}
                role="button"
                tabIndex={0}
                className={`mt-0.5 inline-flex h-9 flex-shrink-0 cursor-grab items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition active:cursor-grabbing ${
                  isDark
                    ? 'border-gray-700 bg-gray-900 text-gray-300 hover:border-emerald-500 hover:text-emerald-300'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-400 hover:text-emerald-600'
                } ${isOrderSaving ? 'pointer-events-none cursor-not-allowed opacity-50' : ''}`}
              >
                <GripVertical className="h-4 w-4" />
                Drag
              </div>
            )}
            <div className="min-w-0">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {String(row.title ?? row.asset_label ?? row.benefit_title ?? row.highlight_text ?? row.member_type ?? row.plan_key ?? row.id)}
              </h3>
              <p className={`mt-1 break-all text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {row.id}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isBenefitRow && (
              <button
                type="button"
                onClick={() => deleteBenefit(row)}
                disabled={isSaving || isUploading || savingAllChanges || savingBenefitOrder}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? 'border border-red-900/60 bg-red-950/40 text-red-200 hover:bg-red-950'
                    : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            {isCoverHighlightRow && (
              <button
                type="button"
                onClick={() => deleteCoverHighlight(row)}
                disabled={isSaving || isUploading || savingAllChanges || savingCoverHighlightOrder}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? 'border border-red-900/60 bg-red-950/40 text-red-200 hover:bg-red-950'
                    : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => revertRow(collectionKey, row)}
              disabled={isSaving || isUploading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isDark
                  ? 'border border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RefreshCcw className="h-4 w-4" />
              {collectionKey === 'assets' ? 'Revert Latest File Change' : 'Revert Latest Change'}
            </button>
            {isSaving && (
              <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <Loader className="h-4 w-4 animate-spin text-green-600" />
                Saving
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {editableFields.map((field) => (
            <div key={field} className={isLongTextField(field, row[field]) ? 'md:col-span-2' : ''}>
              {renderFieldEditor(row, field, (nextField, nextValue) => handleRowFieldChange(collectionKey, row.id, nextField, nextValue))}
            </div>
          ))}
        </div>

        {collectionKey === 'assets' && (
          <div className={`mt-5 rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Replace Stored File</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Uploads to the `{PLAN_DOCS_BUCKET}` bucket and updates the current asset row.
                </p>
                {assetUrl && (
                  <a
                    href={assetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    Open current file
                  </a>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50">
                {isUploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    handleAssetUpload(row, file);
                    event.target.value = '';
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAssetGroups = (rows: CmsRow[]) => {
    const grouped = rows.reduce<Record<string, CmsRow[]>>((acc, row) => {
      const key = typeof row.asset_type === 'string' ? row.asset_type : 'other';
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    const orderedKeys = ['brochure', 'application_form', ...Object.keys(grouped).filter((key) => key !== 'brochure' && key !== 'application_form')];

    return (
      <div className="space-y-6">
        {orderedKeys
          .filter((key) => grouped[key]?.length)
          .map((key) => (
            <div key={key} className={`rounded-2xl border p-5 ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50/80'}`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {getAssetTypeLabel(key)}
                  </h3>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Upload a replacement file to overwrite the current Supabase storage asset for this plan.
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
                  {grouped[key].length} file{grouped[key].length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-4">
                {grouped[key].map((row) => renderRowCard('assets', row))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-[linear-gradient(180deg,#f7fbf8_0%,#eef6f1_100%)]'}`}>
      <div
        className={`border-b transition-colors duration-300 ${
          isDark ? 'border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900 to-emerald-950/40' : 'border-emerald-100 bg-[linear-gradient(120deg,#ffffff_0%,#f0f9f3_55%,#e7f5ec_100%)]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pr-32">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                <LayoutPanelLeft className="h-3.5 w-3.5" />
                CMS Workspace
              </div>
              <h1 className="mt-4 text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                CMS Panel
              </h1>
              <p className={`mt-3 max-w-2xl text-sm leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Update plan content, pricing, brochures, and application forms from one place. The layout is organized for content staff, not developers.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[440px]">
              <div className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/90 shadow-sm'}`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Plan Pages</p>
                <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pages.length}</p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Loaded from Supabase</p>
              </div>
              <div className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/90 shadow-sm'}`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Selected Group</p>
                <p className={`mt-2 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPage ? getPlanFamilyLabel(selectedPage) : 'None'}
                </p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Current editing area</p>
              </div>
              <div className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/90 shadow-sm'}`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Documents</p>
                <p className={`mt-2 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Brochures Ready</p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Replace files from the Assets section</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose a plan group on the left, then edit content sections on the right.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/90 shadow-sm'}`}>
                <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Monthly Report
                </label>
                <input
                  type="month"
                  value={reportMonth}
                  onChange={(event) => setReportMonth(event.target.value)}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${
                    isDark ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleDownloadMonthlyReport}
                disabled={generatingReport}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generatingReport ? <Loader className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Download DOCX
              </button>

              <button
                type="button"
                onClick={fetchPages}
                disabled={loadingPages}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loadingPages ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!hasSupabaseEnv && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Supabase configuration is missing.</p>
                <p className="text-sm">{supabaseConfigError ?? 'Set the required VITE_SUPABASE_* variables before using the CMS panel.'}</p>
              </div>
            </div>
          </div>
        )}

        {status && (
          <div
            className={`mb-6 rounded-xl border p-4 ${
              status.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px,minmax(0,1fr)]">
          <aside className={`rounded-3xl border p-5 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/90 shadow-sm backdrop-blur-sm'}`}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Plan Pages</h2>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Browse by category and choose a page to edit.</p>
              </div>
              {loadingPages && <Loader className="h-4 w-4 animate-spin text-green-600" />}
            </div>

            <div className={`mb-5 rounded-2xl border px-3 py-2.5 ${isDark ? 'border-gray-700 bg-gray-950/80' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <Search className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={sidebarQuery}
                  onChange={(event) => setSidebarQuery(event.target.value)}
                  placeholder="Search plan pages"
                  className={`w-full bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>
            </div>

            <div className={`mb-5 rounded-2xl border p-4 ${isDark ? 'border-emerald-900/60 bg-emerald-950/40' : 'border-emerald-100 bg-emerald-50/80'}`}>
              <div className="flex items-start gap-3">
                <FolderOpen className={`mt-0.5 h-5 w-5 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Content workflow</p>
                  <p className={`mt-1 text-xs leading-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select a plan page, edit the content blocks, then save the updated section. Brochure replacements are handled in the Assets area.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {filteredGroupedPages.map(([familyKey, familyPages]) => (
                <div key={familyKey} className={`rounded-2xl border p-3 ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50/80'}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        {getPlanFamilyLabel(familyPages[0])}
                      </h3>
                      <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {familyPages.length} page{familyPages.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {familyPages.map((page) => {
                      const isSelected = page.id === selectedPageId;
                      const label = getPageCardTitle(page);
                      const meta = getPageCardMeta(page);

                      return (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => setSelectedPageId(page.id)}
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/20'
                              : isDark
                                ? 'border-gray-700 bg-gray-900/70 text-gray-100 hover:border-green-500'
                                : 'border-gray-200 bg-white text-gray-900 hover:border-green-400'
                          }`}
                        >
                          <p className="text-sm font-semibold leading-5">{label}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {meta.length > 0 ? (
                              meta.map((item) => (
                                <span
                                  key={`${page.id}-${item}`}
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                    isSelected
                                      ? 'bg-white/15 text-white'
                                      : isDark
                                        ? 'bg-gray-800 text-gray-300'
                                        : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                  isSelected
                                    ? 'bg-white/15 text-white'
                                    : isDark
                                      ? 'bg-gray-800 text-gray-300'
                                      : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                General
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!loadingPages && pages.length === 0 && (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                  No CMS plan pages found.
                </div>
              )}

              {!loadingPages && pages.length > 0 && filteredGroupedPages.length === 0 && (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                  No plan pages match your search.
                </div>
              )}
            </div>
          </aside>

          <section className="space-y-6">
            {selectedPage && pageDraft ? (
              <>
                <div className={`rounded-3xl border p-6 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/95 shadow-sm'}`}>
                  <div className={`mb-6 rounded-2xl border p-4 ${isDark ? 'border-emerald-900/60 bg-emerald-950/30' : 'border-emerald-100 bg-emerald-50/80'}`}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          {getPlanFamilyLabel(pageDraft)}
                        </p>
                        <h2 className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {String(pageDraft.page_heading ?? pageDraft.hero_title ?? pageDraft.plan_key ?? 'Plan Page')}
                        </h2>
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Edit the main content details for this plan page. Use the sections below for benefits, pricing, and documents.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getPageCardMeta(pageDraft).map((item) => (
                          <span
                            key={`active-${item}`}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-600 shadow-sm'}`}
                          >
                            {item}
                          </span>
                        ))}
                        <button
                          type="button"
                          onClick={saveAllChanges}
                          disabled={!hasUnsavedChanges || isSavingAnyChange}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
                        >
                          {isSavingAnyChange ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-3 ${isDark ? 'border-gray-800 bg-gray-950/70' : 'border-gray-200 bg-gray-50/90'}`}>
                    <div className="flex flex-wrap gap-2">
                      {EDITOR_TABS.map((tab) => {
                        const isActive = activeEditorTab === tab.key;

                        return (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveEditorTab(tab.key)}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                              isActive
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                : isDark
                                  ? 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className={`mt-3 px-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {EDITOR_TABS.find((tab) => tab.key === activeEditorTab)?.description}
                    </p>
                  </div>
                </div>

                {activeEditorTab === 'page' && (
                  <div className={`rounded-3xl border p-6 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/95 shadow-sm'}`}>
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Page Settings</h2>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Update the core labels, route settings, and content metadata used by this page.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={revertPage}
                          disabled={savingPage}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isDark
                              ? 'border border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Revert Latest Change
                        </button>
                        {savingPage && (
                          <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                            <Loader className="h-4 w-4 animate-spin text-green-600" />
                            Saving
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {filterFields(sortEditableFields(pageDraft), getAllowedPageFields(pageDraft)).map((field) => (
                        <div key={field} className={isLongTextField(field, pageDraft[field]) ? 'md:col-span-2' : ''}>
                          {renderFieldEditor(pageDraft, field, handlePageFieldChange)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loadingContent ? (
                  <div className={`rounded-3xl border p-10 text-center ${isDark ? 'border-gray-800 bg-gray-900/70 text-gray-300' : 'border-white/80 bg-white/95 text-gray-600 shadow-sm'}`}>
                    <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-green-600" />
                    Loading CMS content...
                  </div>
                ) : (
                  TABLE_CONFIG.filter((config) => config.key === activeEditorTab).map((config) => {
                    const rows = collections[config.key];
                    return (
                      <div key={config.key} className={`rounded-3xl border p-6 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-white/80 bg-white/95 shadow-sm'}`}>
                        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div>
                              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.title}</h2>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {CMS_SECTION_DESCRIPTIONS[config.key]}
                              </p>
                            </div>
                          </div>
                          {config.key === 'benefits' && (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={addBenefit}
                                disabled={isSavingAnyChange || !selectedPage}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingAllChanges ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Add Benefit
                              </button>
                              <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                                isDark ? 'border-gray-700 bg-gray-950 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'
                              }`}>
                                {savingBenefitOrder ? <Loader className="h-4 w-4 animate-spin text-green-600" /> : <GripVertical className="h-4 w-4 text-green-600" />}
                                {savingBenefitOrder ? 'Saving order...' : 'Drag handles to reorder'}
                              </div>
                            </div>
                          )}
                          {config.key === 'coverHighlights' && (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={addCoverHighlight}
                                disabled={isSavingAnyChange || !selectedPage}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingAllChanges ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Add Cover Highlight
                              </button>
                              <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                                isDark ? 'border-gray-700 bg-gray-950 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'
                              }`}>
                                {savingCoverHighlightOrder ? <Loader className="h-4 w-4 animate-spin text-green-600" /> : <GripVertical className="h-4 w-4 text-green-600" />}
                                {savingCoverHighlightOrder ? 'Saving order...' : 'Drag handles to reorder'}
                              </div>
                            </div>
                          )}
                        </div>

                        {config.key === 'benefits' && (
                          <div className={`mb-6 rounded-2xl border p-4 ${isDark ? 'border-emerald-900/60 bg-emerald-950/30' : 'border-emerald-100 bg-emerald-50/70'}`}>
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                              <div>
                                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hospital day cards — global update</h3>
                                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Saves these three descriptions to every matching plan detail page in one action.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={saveHospitalDayCards}
                                disabled={savingHospitalDayCards || pages.length === 0}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingHospitalDayCards ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Update All Plan Pages
                              </button>
                            </div>
                            <div className="mt-4 grid gap-3">
                              {HOSPITAL_DAY_CARD_TITLES.map((title) => (
                                <label key={title} className="grid gap-1.5">
                                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{title}</span>
                                  <textarea
                                    value={hospitalDayCardSummaries[title]}
                                    onChange={(event) =>
                                      setHospitalDayCardSummaries((current) => ({ ...current, [title]: event.target.value }))
                                    }
                                    rows={2}
                                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 ${
                                      isDark ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-900'
                                    }`}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {rows.length === 0 ? (
                          <div className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                            {config.emptyMessage}
                          </div>
                        ) : config.key === 'assets' ? (
                          renderAssetGroups(rows)
                        ) : (
                          <div className="space-y-4">
                            {rows.map((row) => renderRowCard(config.key, row))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            ) : (
              <div className={`rounded-3xl border p-10 text-center ${isDark ? 'border-gray-800 bg-gray-900/70 text-gray-300' : 'border-white/80 bg-white/95 text-gray-600 shadow-sm'}`}>
                <FileText className="mx-auto mb-4 h-10 w-10 text-green-600" />
                Select a plan page from the left to begin editing content.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminCmsPlaceholderPage;
