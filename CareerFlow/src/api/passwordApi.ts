import { apiPost } from './client';

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface PasswordResponse {
    message: string;
}

export const passwordApi = {
    forgotPassword: (email: string) =>
        apiPost<PasswordResponse>('/api/auth/forgot-password', {
            email,
        }),

    resetPassword: (data: ResetPasswordRequest) =>
        apiPost<PasswordResponse>('/api/auth/reset-password', data),

    changePassword: (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) =>
        apiPost<PasswordResponse>('/api/auth/change-password', data),
};