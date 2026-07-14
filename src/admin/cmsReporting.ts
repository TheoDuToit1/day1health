import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

export type CmsAuditSection = 'page' | 'benefits' | 'coverHighlights' | 'priceRows' | 'assets';
export type CmsAuditAction = 'update' | 'replace_file' | 'revert';

export type CmsChangeLogInsert = {
  page_id: string | null;
  plan_family: string;
  plan_key: string;
  page_heading: string;
  section_key: CmsAuditSection;
  action_type: CmsAuditAction;
  table_name: string;
  record_id: string | null;
  changed_by: string | null;
  changed_by_email: string;
  started_at: string;
  completed_at: string;
  duration_seconds: number;
  change_summary: string;
  previous_values: Record<string, unknown>;
  next_values: Record<string, unknown>;
  changed_fields: string[];
  file_name_before?: string | null;
  file_name_after?: string | null;
};

export type CmsChangeLogRow = CmsChangeLogInsert & {
  id: string;
  created_at?: string;
};

const isEqualValue = (left: unknown, right: unknown): boolean => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

const sanitizeRecord = (record: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      value instanceof Date ? value.toISOString() : value ?? null,
    ]),
  );

export const diffRecords = (
  previousRecord: Record<string, unknown> | null | undefined,
  nextRecord: Record<string, unknown> | null | undefined,
): {
  changedFields: string[];
  previousValues: Record<string, unknown>;
  nextValues: Record<string, unknown>;
} => {
  const previous = previousRecord ?? {};
  const next = nextRecord ?? {};
  const fieldNames = [...new Set([...Object.keys(previous), ...Object.keys(next)])];
  const changedFields = fieldNames.filter((field) => !isEqualValue(previous[field], next[field]));

  return {
    changedFields,
    previousValues: sanitizeRecord(
      Object.fromEntries(changedFields.map((field) => [field, previous[field] ?? null])),
    ),
    nextValues: sanitizeRecord(
      Object.fromEntries(changedFields.map((field) => [field, next[field] ?? null])),
    ),
  };
};

export const getDurationSeconds = (startedAt: string | null | undefined, completedAt: string): number => {
  if (!startedAt) return 0;
  const startMs = Date.parse(startedAt);
  const endMs = Date.parse(completedAt);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return 0;
  return Math.max(0, Math.round((endMs - startMs) / 1000));
};

export const formatDuration = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};

export const monthInputToRange = (monthValue: string): { startIso: string; endIso: string; label: string; fileStamp: string } => {
  const [yearText, monthText] = monthValue.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const label = startDate.toLocaleString('en-ZA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return {
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
    label,
    fileStamp: `${yearText}-${monthText}`,
  };
};

export const getCurrentMonthInputValue = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const buildAuditSummary = (
  section: CmsAuditSection,
  changedFields: string[],
  actionType: CmsAuditAction,
  pageLabel: string,
): string => {
  if (actionType === 'replace_file') {
    return `Replaced ${section === 'assets' ? 'asset file' : 'file'} for ${pageLabel}`;
  }

  if (actionType === 'revert') {
    if (changedFields.length === 0) {
      return `Reverted latest ${section} change for ${pageLabel}`;
    }

    return `Reverted ${section} fields for ${pageLabel}: ${changedFields.join(', ')}`;
  }

  if (changedFields.length === 0) {
    return `Saved ${section} for ${pageLabel}`;
  }

  return `Updated ${section} fields for ${pageLabel}: ${changedFields.join(', ')}`;
};

const buildSummaryMetrics = (rows: CmsChangeLogRow[]) => {
  const totals = {
    totalChanges: rows.length,
    replacementCount: rows.filter((row) => row.action_type === 'replace_file').length,
    contentCount: rows.filter((row) => row.section_key === 'page' || row.section_key === 'benefits' || row.section_key === 'coverHighlights').length,
    pricingCount: rows.filter((row) => row.section_key === 'priceRows').length,
    assetCount: rows.filter((row) => row.section_key === 'assets').length,
    totalDurationSeconds: rows.reduce((sum, row) => sum + Number(row.duration_seconds ?? 0), 0),
  };

  const byPlanFamily = rows.reduce<Record<string, number>>((acc, row) => {
    const key = row.plan_family || 'other';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return { totals, byPlanFamily };
};

const asText = (value: unknown): string => {
  if (value == null) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
};

export const downloadMonthlyDocxReport = async (params: {
  monthLabel: string;
  fileStamp: string;
  generatedBy: string;
  rows: CmsChangeLogRow[];
}): Promise<void> => {
  const { monthLabel, fileStamp, generatedBy, rows } = params;
  const { totals, byPlanFamily } = buildSummaryMetrics(rows);

  const summaryRows = [
    ['Total changes', String(totals.totalChanges)],
    ['File replacements', String(totals.replacementCount)],
    ['Content edits', String(totals.contentCount)],
    ['Pricing edits', String(totals.pricingCount)],
    ['Asset actions', String(totals.assetCount)],
    ['Tracked time', formatDuration(totals.totalDurationSeconds)],
  ];

  const familyRows = Object.entries(byPlanFamily)
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([family, count]) => [family, String(count)]);

  const activityHeader = new TableRow({
    children: ['Date', 'Plan Page', 'Section', 'Action', 'Duration', 'Summary'].map(
      (label) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
        }),
    ),
  });

  const activityRows = rows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: asText(row.completed_at).slice(0, 10) })] }),
          new TableCell({ children: [new Paragraph({ text: row.page_heading || row.plan_key || row.plan_family })] }),
          new TableCell({ children: [new Paragraph({ text: row.section_key })] }),
          new TableCell({ children: [new Paragraph({ text: row.action_type })] }),
          new TableCell({ children: [new Paragraph({ text: formatDuration(Number(row.duration_seconds ?? 0)) })] }),
          new TableCell({ children: [new Paragraph({ text: row.change_summary || '-' })] }),
        ],
      }),
  );

  const replacementRows = rows
    .filter((row) => row.action_type === 'replace_file')
    .map(
      (row) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: row.page_heading || row.plan_key || row.plan_family })] }),
            new TableCell({ children: [new Paragraph({ text: row.file_name_before || '-' })] }),
            new TableCell({ children: [new Paragraph({ text: row.file_name_after || '-' })] }),
            new TableCell({ children: [new Paragraph({ text: formatDuration(Number(row.duration_seconds ?? 0)) })] }),
          ],
        }),
    );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'Day1 Health CMS Monthly Report',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${monthLabel}\n`, bold: true }),
              new TextRun({ text: `Generated by: ${generatedBy}` }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: summaryRows.map(
              ([label, value]) =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ text: value })] }),
                  ],
                }),
            ),
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Changes By Plan Family', heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Plan Family', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Changes', bold: true })] })] }),
                ],
              }),
              ...familyRows.map(
                ([family, count]) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: family })] }),
                      new TableCell({ children: [new Paragraph({ text: count })] }),
                    ],
                  }),
              ),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Detailed Activity Log', heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [activityHeader, ...activityRows],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'File Replacements', heading: HeadingLevel.HEADING_1 }),
          replacementRows.length > 0
            ? new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: ['Plan Page', 'Previous File', 'Replacement File', 'Duration'].map(
                      (label) =>
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
                        }),
                    ),
                  }),
                  ...replacementRows,
                ],
              })
            : new Paragraph({ text: 'No brochure or application-form replacements were recorded for this month.' }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `day1health-cms-report-${fileStamp}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
