import { apiPost } from './client';

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  role?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'JobSeeker' | 'Business';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiPost<AuthResponse>('/api/Auth/register', payload, false),

  login: (payload: LoginPayload) =>
    apiPost<AuthResponse>('/api/Auth/login', payload, false),
};
