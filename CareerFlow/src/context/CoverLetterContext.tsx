import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import type { ReactNode } from 'react';

import { useAuth } from './AuthContext';

interface CoverLetterDraft {
    selectedCvId: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
    content: string;
}

interface CoverLetterContextValue
    extends CoverLetterDraft {
    setSelectedCvId: (value: string) => void;
    setJobTitle: (value: string) => void;
    setCompany: (value: string) => void;
    setJobDescription: (value: string) => void;
    setContent: (value: string) => void;
    clearCoverLetter: () => void;
}

const emptyDraft: CoverLetterDraft = {
    selectedCvId: '',
    jobTitle: '',
    company: '',
    jobDescription: '',
    content: '',
};

const CoverLetterContext =
    createContext<CoverLetterContextValue | null>(null);

export function CoverLetterProvider({
                                        children,
                                    }: {
    children: ReactNode;
}) {
    const { user } = useAuth();

    const [draft, setDraft] =
        useState<CoverLetterDraft>(emptyDraft);

    /*
     * Cover letters are temporary.
     *
     * When the authenticated user changes or logs out,
     * clear the temporary cover letter.
     *
     * Nothing is stored in localStorage/sessionStorage
     * or sent to the database by this context.
     */
    useEffect(() => {
        setDraft(emptyDraft);
    }, [user?.userId]);

    const setSelectedCvId = (value: string) => {
        setDraft(previous => ({
            ...previous,
            selectedCvId: value,
        }));
    };

    const setJobTitle = (value: string) => {
        setDraft(previous => ({
            ...previous,
            jobTitle: value,
        }));
    };

    const setCompany = (value: string) => {
        setDraft(previous => ({
            ...previous,
            company: value,
        }));
    };

    const setJobDescription = (value: string) => {
        setDraft(previous => ({
            ...previous,
            jobDescription: value,
        }));
    };

    const setContent = (value: string) => {
        setDraft(previous => ({
            ...previous,
            content: value,
        }));
    };

    const clearCoverLetter = () => {
        setDraft(emptyDraft);
    };

    return (
        <CoverLetterContext.Provider
            value={{
                ...draft,
                setSelectedCvId,
                setJobTitle,
                setCompany,
                setJobDescription,
                setContent,
                clearCoverLetter,
            }}
        >
            {children}
        </CoverLetterContext.Provider>
    );
}

export function useCoverLetterDraft() {
    const context = useContext(CoverLetterContext);

    if (!context) {
        throw new Error(
            'useCoverLetterDraft must be used inside CoverLetterProvider'
        );
    }

    return context;
}