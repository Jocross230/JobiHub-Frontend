import { apiGet, apiPut, apiDelete } from './client';

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalCvs: number;
    cvsToday: number;
    totalBusinesses: number;
    activeBusinesses: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    openRecruitmentRequests: number;
    openSupportIssues: number;
}

export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
    cvCount: number;
}

export interface SupportIssue {
    id: string;
    userId?: string;
    businessId?: string;
    reporterName: string;
    category: string;
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
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

export interface ActivityLog {
    id: string;
    action: string;
    actorId?: string;
    actorName?: string;
    targetType?: string;
    targetId?: string;
    details?: string;
    occurredAt: string;
}

export const adminApi = {
    // Dashboard
    getStats: () =>
        apiGet<AdminStats>('/api/Admin/stats'),

    // Users
    getUsers: () =>
        apiGet<AdminUser[]>('/api/Admin/users'),

    deactivateUser: (id: string) =>
        apiPut(`/api/Admin/users/${id}/deactivate`),

    reactivateUser: (id: string) =>
        apiPut(`/api/Admin/users/${id}/reactivate`),

    // CVs
    getCvs: () =>
        apiGet('/api/Admin/cvs'),

    deleteCv: (id: string) =>
        apiDelete(`/api/Admin/cvs/${id}`),

    // Businesses
    getBusinesses: () =>
        apiGet('/api/Admin/businesses'),

    approveBusiness: (id: string) =>
        apiPut(`/api/Admin/businesses/${id}/approve`),

    suspendBusiness: (id: string) =>
        apiPut(`/api/Admin/businesses/${id}/suspend`),

    // Jobs
    getAllJobs: () =>
        apiGet('/api/Admin/jobs'),

    removeJob: (id: string) =>
        apiDelete(`/api/Admin/jobs/${id}`),

    changeJobStatus: (id: string, status: string) =>
        apiPut(`/api/Admin/jobs/${id}/status`, { status }),

    // Recruitment
    getRecruitmentRequests: () =>
        apiGet('/api/admin/recruitment'),

    updateRecruitmentStatus: (id: string, status: string) =>
        apiPut(`/api/admin/recruitment/${id}/status`, { status }),

    // Support
    getSupportIssues: () =>
        apiGet<SupportIssue[]>('/api/Admin/support'),

    updateIssueStatus: (id: string, status: string) =>
        apiPut(`/api/Admin/support/${id}/status`, { status }),

    // Activity
    getActivityLogs: () =>
        apiGet<ActivityLog[]>('/api/Admin/activity'),

    // Analytics
    getAnalyticsData: (period: string) =>
        apiGet<{
            userGrowth: { date: string; count: number }[];
            cvCreation: { date: string; count: number }[];
            jobPostings: { date: string; count: number }[];
            businessRegistrations: { date: string; count: number }[];
        }>(`/api/Admin/analytics?period=${encodeURIComponent(period)}`),
};