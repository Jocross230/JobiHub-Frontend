import { apiDelete, apiGet, apiPost } from './client';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workArrangement: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: string;
  salary?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  skills: string[];
  benefits?: string;
  source: 'careerflow' | 'external';
  externalUrl?: string;
  postedAt: string;
  closingDate?: string;
  status?: string;
  businessId?: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  workArrangement?: string;
  employmentType?: string;
  experienceLevel?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface SavedJob {
  id: number;
  jobId: number;
  job: Job;
  savedAt: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  cvId: string;
  status: string;
  appliedAt: string;

  job?: {
    id: number;
    title: string;
    location: string;
    employmentType: string;
    workArrangement: string;
    salary?: string;
  };

  cv?: {
    id: string;
    fullName: string;
    professionalTitle: string;
  };
}

export const jobsApi = {
  search: async (params: JobSearchParams = {}) => {
    const jobs = await apiGet<Job[]>('/api/jobs', false);

    const filtered = jobs.filter(job => {
      if (
          params.query &&
          !job.title.toLowerCase().includes(params.query.toLowerCase()) &&
          !job.company.toLowerCase().includes(params.query.toLowerCase()) &&
          !job.skills.some(skill =>
              skill.toLowerCase().includes(params.query!.toLowerCase())
          )
      ) {
        return false;
      }

      if (
          params.location &&
          !job.location.toLowerCase().includes(params.location.toLowerCase())
      ) {
        return false;
      }

      if (
          params.workArrangement &&
          params.workArrangement !== 'All' &&
          job.workArrangement !== params.workArrangement
      ) {
        return false;
      }

      if (
          params.employmentType &&
          params.employmentType !== 'All' &&
          job.employmentType !== params.employmentType
      ) {
        return false;
      }

      if (
          params.experienceLevel &&
          params.experienceLevel !== 'All' &&
          job.experienceLevel !== params.experienceLevel
      ) {
        return false;
      }

      return true;
    });

    return {
      jobs: filtered,
      total: filtered.length,
    };
  },

  getById: (id: string) =>
      apiGet<Job>(`/api/jobs/${id}`, false),

  getRecommended: async () => {
    const jobs = await apiGet<Job[]>('/api/jobs', false);
    return jobs.slice(0, 6);
  },

  apply: (jobId: string, cvId: string) =>
      apiPost<JobApplication>('/api/applications', {
        jobId: Number(jobId),
        cvId,
      }),

  getMyApplications: () =>
      apiGet<JobApplication[]>('/api/applications/my'),

  saveJob: (jobId: string) =>
      apiPost<SavedJob>('/api/Jobs/saved', {
        jobId: Number(jobId),
      }),

  getSavedJobs: () =>
      apiGet<SavedJob[]>('/api/Jobs/saved'),

  removeSavedJob: (savedJobId: number) =>
      apiDelete(`/api/Jobs/saved/${savedJobId}`),
};