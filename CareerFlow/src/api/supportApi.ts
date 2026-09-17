import { apiGet, apiPost } from './client';

export interface SupportIssue {
    id: string;
    userId?: string;
    businessId?: string;
    reporterName: string;
    category: string;
    subject: string;
    description: string;
    priority:
        | 'low'
        | 'medium'
        | 'high'
        | 'critical';
    status:
        | 'Open'
        | 'In Progress'
        | 'Waiting for User'
        | 'Resolved'
        | 'Closed';
    assignedTo?: string;
    createdAt: string;
    resolution?: string;
}

export interface SubmitSupportRequest {
    category: string;
    subject: string;
    description: string;
    priority: string;
}

export const supportApi = {
    submit: async (
        data: SubmitSupportRequest
    ) => {
        return await apiPost<{
            message: string;
            id: number;
            status: string;
            createdAt: string;
        }>(
            '/api/support',
            data
        );
    },

    getMyIssues: async () => {
        return await apiGet<SupportIssue[]>(
            '/api/support/my'
        );
    },
};