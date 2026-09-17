import { apiGet, apiPost } from './client';

export interface RecruitmentRequest {
  id: number;
  positionTitle: string;
  numberOfCandidates: number;
  urgency: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  requirements: string;
  skills: string;
  additionalMessage: string;
  status: string;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitRecruitmentRequest {
  positionTitle: string;
  numberOfCandidates: number;
  urgency: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  requirements: string;
  skills: string;
  additionalMessage: string;
}

export const recruitmentApi = {
  submit: async (data: SubmitRecruitmentRequest) => {
    return await apiPost<{
      message: string;
      id: number;
      status: string;
      createdAt: string;
    }>('/api/business/recruitment', data);
  },

  getMyRequests: async () => {
    return await apiGet<RecruitmentRequest[]>(
        '/api/business/recruitment'
    );
  },

  getById: async (id: number) => {
    return await apiGet<RecruitmentRequest>(
        `/api/business/recruitment/${id}`
    );
  },
};