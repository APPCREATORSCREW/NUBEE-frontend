import { create } from "zustand";

export type SignupFlow = 'signup' | null;

// 일반 회원가입
interface SignupDraft {
    flow?: SignupFlow;
    username?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
    birthDate?: string;
    preferredKeywordCount?: number;
    parentEmail?: string | null;
}

interface SignupDraftState {
    draft: SignupDraft;
    setDraft: (draft: Partial<SignupDraft>) => void;
    clearDraft: () => void;
}

export const useSignupDraftStore = create<SignupDraftState>((set) => ({
    draft: {},

    setDraft: (data) => 
        set((state) => ({
            draft: {...state.draft, ...data}
        })),

    clearDraft: () => set({ draft: {} }),
}))
