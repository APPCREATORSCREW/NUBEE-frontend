import { create } from "zustand";

interface TutorialState {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  currentPage: 0,
  setCurrentPage: (page: number) => set({ currentPage: page }),
}));
