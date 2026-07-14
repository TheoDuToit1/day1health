import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../admin/supabaseClient';

export type CmsAssetRow = Record<string, any> & { id?: string };

export const resolveCmsAssetUrl = (asset: CmsAssetRow | null): string | null => {
  if (!asset) return null;
  if (typeof asset.public_url === 'string' && asset.public_url.length > 0) return asset.public_url;
  if (typeof asset.asset_url === 'string' && asset.asset_url.length > 0) return asset.asset_url;
  if (typeof asset.storage_path === 'string' && asset.storage_path.length > 0) {
    return supabase.storage.from('plan-docs').getPublicUrl(asset.storage_path).data.publicUrl;
  }
  return null;
};

export const useCmsAssetHref = (asset: CmsAssetRow | null, fallbackHref: string): string => {
  const candidateHref = useMemo(() => resolveCmsAssetUrl(asset), [asset]);
  const [href, setHref] = useState<string>(fallbackHref);

  useEffect(() => {
    let isActive = true;

    if (!candidateHref) {
      setHref(fallbackHref);
      return () => {
        isActive = false;
      };
    }

    const verifyAsset = async () => {
      try {
        const response = await fetch(candidateHref, {
          method: 'HEAD',
          cache: 'no-store',
        });

        if (!isActive) {
          return;
        }

        setHref(response.ok ? candidateHref : fallbackHref);
      } catch {
        if (isActive) {
          setHref(fallbackHref);
        }
      }
    };

    void verifyAsset();

    return () => {
      isActive = false;
    };
  }, [candidateHref, fallbackHref]);

  return href;
};
