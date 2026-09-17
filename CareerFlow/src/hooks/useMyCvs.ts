import { useCallback, useEffect, useState } from 'react';
import { cvApi } from '../api/cvApi';
import type { Cv } from '../api/cvApi';

export function useMyCvs() {
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cvApi.myCvs();
      setCvs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load CVs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { cvs, loading, error, refetch: fetch };
}
