import { apiGet, apiPost, apiPut } from './client';

export interface PaymentRequest {
    product: string;
    amount: number;
    paymentReference: string;
}

export interface Payment {
    id: number;
    userId?: number;
    userName?: string;
    userEmail?: string;
    product: string;
    amount: number;
    paymentReference: string;
    status: string;
    createdAt: string;
    reviewedAt?: string | null;
    expiresAt?: string | null;
}

export const paymentsApi = {
    submit: (data: PaymentRequest) =>
        apiPost<{
            message: string;
            paymentId: number;
            status: string;
        }>('/api/payments/request', data),
    status: (product: string) =>
        apiGet<{
            approved: boolean;
            product: string;
            status: string;
            expiresAt?: string | null;
        }>(`/api/payments/status?product=${encodeURIComponent(product)}`),

    myPayments: () =>
        apiGet<Payment[]>('/api/payments/my-payments'),

    adminAll: () =>
        apiGet<Payment[]>('/api/payments/admin/all'),

    review: (id: number, status: 'Approved' | 'Rejected') =>
        apiPut<{
            message: string;
            paymentId: number;
            status: string;
        }>(`/api/payments/admin/${id}/review`, {
            status,
        }),
};