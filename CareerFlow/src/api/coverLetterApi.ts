import { apiPost } from './client';

export interface GenerateCoverLetterPayload {
  cvId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}

export interface CoverLetterResult {
  coverLetter: string;
}

export const coverLetterApi = {
  generate: (payload: GenerateCoverLetterPayload) =>
      apiPost<CoverLetterResult>(
          '/api/CoverLetter/generate',
          payload
      ),
};