import {  apiDelete,apiGet, apiPost, apiPut } from './client';

export interface Business {
  id: string;
  userId?: number;
  companyName: string;
  industry: string;
  description: string;
  location: string;
  website?: string;
  companySize: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}
export interface BusinessApplicant {
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
  };

  applicant?: {
    cvId: string;
    fullName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    location: string;
  };

  cv?: {
    id: string;
    fullName: string;
    professionalTitle: string;
  };
}
export interface Candidate {
  id: string;
  fullName: string;
  professionalTitle: string;
  shortBio: string;
  location: string;

  skills: {
    id: string;
    name: string;
  }[];
}
export interface SubmittedCv {
  application: {
    id: number;
    status: string;
    appliedAt: string;

    job?: {
      id: number;
      title: string;
      location: string;
      employmentType: string;
      workArrangement: string;
    };
  };

  cv: {
    id: string;
    userId?: number;
    fullName: string;
    professionalTitle: string;
    shortBio: string;
    email: string;
    phone: string;
    location: string;
    linkedInUrl: string;
    gitHubUrl: string;
    createdAt?: string;
    updatedAt?: string;

    skills: {
      id: string;
      name: string;
    }[];

    experiences: {
      id: string;
      jobTitle: string;
      company: string;
      location: string;
      startDate?: string;
      endDate?: string;
      isCurrent: boolean;
      description: string;
    }[];

    projects: {
      id: string;
      title: string;
      role: string;
      description: string;
      technologies: string;
      projectUrl: string;
    }[];

    educations: {
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      location: string;
      startDate?: string;
      endDate?: string;
      isCurrent: boolean;
    }[];
  };
}
export interface CandidateCv {
  cv: {
    id: string;
    userId?: number;
    fullName: string;
    professionalTitle: string;
    shortBio: string;
    email: string;
    phone: string;
    location: string;
    linkedInUrl: string;
    gitHubUrl: string;
    createdAt?: string;
    updatedAt?: string;

    skills: {
      id: string;
      name: string;
    }[];

    experiences: {
      id: string;
      jobTitle: string;
      company: string;
      location: string;
      startDate?: string;
      endDate?: string;
      isCurrent: boolean;
      description: string;
    }[];

    projects: {
      id: string;
      title: string;
      role: string;
      description: string;
      technologies: string;
      projectUrl: string;
    }[];

    educations: {
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      location: string;
      startDate?: string;
      endDate?: string;
      isCurrent: boolean;
    }[];
  };
}

export interface BusinessJob {
  id: string;
  businessId: string;
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  location: string;
  workArrangement: string;
  employmentType: string;
  experienceLevel: string;
  salary?: string;
  applicationMethod: string;
  closingDate?: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBusinessJobRequest {
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  location: string;
  workArrangement: string;
  employmentType: string;
  experienceLevel: string;
  salary: string;
  applicationMethod: string;
  closingDate: string | null;
  status: 'draft' | 'published';
}
export interface SavedCandidate {
  id: number;
  cvId: string;
  savedAt: string;

  candidate: {
    id: string;
    fullName: string;
    professionalTitle: string;
    shortBio: string;
    location: string;

    skills: {
      id: string;
      name: string;
    }[];
  };
}


export const businessApi = {
  register: async (data: Partial<Business>) => {
    const response = await apiPost<{
      message: string;
      business: Business;
    }>('/api/business/profile', data);

    return response.business;
  },
  saveCandidate: async (cvId: string) => {
    return await apiPost<{
      message: string;
      id: number;
      cvId: string;
      savedAt: string;
    }>(
        '/api/business/saved-candidates',
        {
          cvId,
        }
    );
  },

  getSavedCandidates: async () => {
    return await apiGet<SavedCandidate[]>(
        '/api/business/saved-candidates'
    );
  },

  checkSavedCandidate: async (cvId: string) => {
    return await apiGet<{
      cvId: string;
      saved: boolean;
    }>(
        `/api/business/saved-candidates/check/${cvId}`
    );
  },

  removeSavedCandidate: async (cvId: string) => {
    return await apiDelete(
        `/api/business/saved-candidates/${cvId}`
    );
  },
  searchCandidates: async (params?: {
    query?: string;
    location?: string;
    title?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (params?.query) {
      searchParams.set('query', params.query);
    }

    if (params?.location) {
      searchParams.set('location', params.location);
    }

    if (params?.title) {
      searchParams.set('title', params.title);
    }

    const queryString = searchParams.toString();

    return await apiGet<Candidate[]>(
        `/api/business/candidates${queryString ? `?${queryString}` : ''}`
    );
  },

  getMyBusiness: async () => {
    try {
      return await apiGet<Business>('/api/business/profile');
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  updateBusiness: async (_id: string, data: Partial<Business>) => {
    const response = await apiPost<{
      message: string;
      business: Business;
    }>('/api/business/profile', data);

    return response.business;
  },

  postJob: async (
      _businessId: string,
      data: CreateBusinessJobRequest
  ) => {
    const response = await apiPost<{
      message: string;
      job: BusinessJob;
    }>('/api/business/jobs', data);

    return response.job;
  },

  getMyJobs: async (_businessId?: string) => {
    return await apiGet<BusinessJob[]>('/api/business/jobs');
  },

  updateJob: async (
      _businessId: string,
      _jobId: string,
      data: Partial<BusinessJob>
  ) => {
    return await apiPut<BusinessJob>(
        `/api/business/jobs/${_jobId}`,
        data
    );
  },

  closeJob: async (
      _businessId: string,
      _jobId: string
  ) => {
    await apiPut<BusinessJob>(
        `/api/business/jobs/${_jobId}/close`,
        {}
    );
  },
  getApplicants: async () => {
    return await apiGet<BusinessApplicant[]>(
        '/api/business/applicants'
    );
  },
  getCandidateCv: async (cvId: string) => {
    return await apiGet<CandidateCv>(
        `/api/business/candidates/${cvId}`
    );
  },
  getApplicantCv: async (applicationId: string) => {
    return await apiGet<SubmittedCv>(
        `/api/business/applicants/${applicationId}/cv`
    );
  },
  updateApplicantStatus: async (
      applicationId: string,
      status: string
  ) => {
    return await apiPut<{
      message: string;
      applicationId: number;
      status: string;
    }>(
        `/api/business/applicants/${applicationId}/status`,
        {
          status,
        }
    );
  },
  deleteApplicant: async (applicationId: string) => {
    return await apiDelete(
        `/api/business/applicants/${applicationId}`
    );
  },

};
