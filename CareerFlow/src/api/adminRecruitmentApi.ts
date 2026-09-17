import { apiGet, apiPut } from './client';

export interface AdminRecruitmentRequest {
    id: number;
    businessId: number;
    companyName: string;
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

export const adminRecruitmentApi = {
    getAll: async () => {
        return await apiGet<AdminRecruitmentRequest[]>(
            '/api/admin/recruitment'
        );
    },

    getById: async (id: number) => {
        return await apiGet<AdminRecruitmentRequest>(
            `/api/admin/recruitment/${id}`
        );
    },

    updateStatus: async (
        id: number,
        status: string
    ) => {
        return await apiPut<{
            message: string;
            id: number;
            status: string;
            updatedAt: string;
        }>(
            `/api/admin/recruitment/${id}/status`,
            {
                status,
            }
        );
    },

    updateNotes: async (
        id: number,
        adminNotes: string
    ) => {
        return await apiPut<{
            message: string;
            id: number;
            adminNotes: string;
            updatedAt: string;
        }>(
            `/api/admin/recruitment/${id}/notes`,
            {
                adminNotes,
            }
        );
    },
};