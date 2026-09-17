import { apiGet, apiPut } from './client';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  professionalTitle?: string;
  skills?: string[];
  linkedInUrl?: string;
  gitHubUrl?: string;
  websiteUrl?: string;
  bio?: string;
  profileCompletion?: number;
}

export const userApi = {
  getProfile: () => apiGet<UserProfile>('/api/User/profile'),
  updateProfile: (data: Partial<UserProfile>) => apiPut<UserProfile>('/api/User/profile', data),
};
