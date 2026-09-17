import { apiDelete, apiGet, apiPost, apiPut } from './client';


export interface Cv {
  id: string;
  userId: string;
  fullName: string;
  professionalTitle: string;
  shortBio: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl: string;
  gitHubUrl: string;
  template?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CvSkill {
  id: string;
  name: string;
}

export interface CvExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface CvProject {
  id: string;
  title: string;
  role: string;
  description: string;
  technologies: string;
  projectUrl?: string;
}

export interface CvEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

function normalizeExperiencePayload(
    data: Partial<CvExperience>
): Partial<CvExperience> {
  const normalizeDate = (value?: string) => {
    if (!value) return undefined;

    if (/^\d{4}-\d{2}$/.test(value)) {
      return `${value}-01`;
    }

    return value;
  };

  return {
    ...data,
    startDate: normalizeDate(data.startDate),
    endDate: normalizeDate(data.endDate),
  };
}
export const cvApi = {
  create: (data: Partial<Cv>) => apiPost<Cv>('/api/Cv', data),
  get: (id: string) => apiGet<Cv>(`/api/Cv/${id}`),
  update: (id: string, data: Partial<Cv>) => apiPut<Cv>(`/api/Cv/${id}`, data),
  delete: (id: string) => apiDelete(`/api/Cv/${id}`),
  myCvs: () => apiGet<Cv[]>('/api/Cv/my-cvs'),

  addSkill: (cvId: string, name: string) =>
    apiPost<CvSkill>(`/api/Cv/${cvId}/skills`, { name }),
  getSkills: (cvId: string) => apiGet<CvSkill[]>(`/api/Cv/${cvId}/skills`),
  deleteSkill: (cvId: string, skillId: string) =>
    apiDelete(`/api/Cv/${cvId}/skills/${skillId}`),

      addExperience: (cvId: string, data: Partial<CvExperience>) =>
          apiPost<CvExperience>(
              `/api/Cv/${cvId}/experiences`,
              normalizeExperiencePayload(data)
          ),
  getExperiences: (cvId: string) =>
    apiGet<CvExperience[]>(`/api/Cv/${cvId}/experiences`),
  updateExperience: (
      cvId: string,
      id: string,
      data: Partial<CvExperience>
  ) =>
      apiPut<CvExperience>(
          `/api/Cv/${cvId}/experiences/${id}`,
          normalizeExperiencePayload(data)
      ),
  deleteExperience: (cvId: string, id: string) =>
    apiDelete(`/api/Cv/${cvId}/experiences/${id}`),

  addProject: (cvId: string, data: Partial<CvProject>) =>
    apiPost<CvProject>(`/api/Cv/${cvId}/projects`, data),
  getProjects: (cvId: string) => apiGet<CvProject[]>(`/api/Cv/${cvId}/projects`),
  updateProject: (cvId: string, id: string, data: Partial<CvProject>) =>
    apiPut<CvProject>(`/api/Cv/${cvId}/projects/${id}`, data),
  deleteProject: (cvId: string, id: string) =>
    apiDelete(`/api/Cv/${cvId}/projects/${id}`),

  addEducation: (cvId: string, data: Partial<CvEducation>) =>
    apiPost<CvEducation>(`/api/Cv/${cvId}/educations`, data),
  getEducations: (cvId: string) =>
    apiGet<CvEducation[]>(`/api/Cv/${cvId}/educations`),
  updateEducation: (cvId: string, id: string, data: Partial<CvEducation>) =>
    apiPut<CvEducation>(`/api/Cv/${cvId}/educations/${id}`, data),
  deleteEducation: (cvId: string, id: string) =>
    apiDelete(`/api/Cv/${cvId}/educations/${id}`),
};
