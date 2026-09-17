import { apiGet } from './client';

export interface ExternalJob {
    title: string;
    company: string;
    location: string;
    workArrangement: string;
    employmentType: string;
    experienceLevel: string;
    salary: string;
    postedAt: string;
    externalUrl: string;
    sourceName: string;
    description: string;
    skills: string[];
}

interface AIJobSearchResponse {
    jobs: ExternalJob[];
}

export const aiJobsApi = {
    search: async (params: {
        query: string;
        location?: string;
    }) => {
        const searchParams = new URLSearchParams();

        searchParams.set('query', params.query);

        if (params.location) {
            searchParams.set('location', params.location);
        }

        return await apiGet<AIJobSearchResponse>(
            `/api/jobs/ai-search?${searchParams.toString()}`
        );
    },
};