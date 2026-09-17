import { useCallback, useEffect, useState } from 'react';
import { jobsApi } from '../api/jobsApi';
import type { SavedJob } from '../api/jobsApi';

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsApi.getSavedJobs();
      setSavedJobs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const removeJob = useCallback(async (savedJobId: number) => {
    await jobsApi.removeSavedJob(savedJobId);
    setSavedJobs(prev => prev.filter(j => j.id !== savedJobId));
  }, []);

  return { savedJobs, loading, error, refetch: fetch, removeJob };
}
