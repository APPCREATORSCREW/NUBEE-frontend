import { create } from "zustand";

interface Skin {
  id: number;
  name: string;
  level: number;
  image?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  streak: number;
  points: number;
  profileImage: string | null;
  loginType: "email" | "kakao";
}

interface UserSettings {
  keywordCount: number;
  notificationEnabled: boolean;
  notificationTime: string; // "17:30" 형식
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  selectedSkin: Skin | null;
  settings: UserSettings;
  visitedKeywords: string[];

  login: (user: User, token: string) => void;
  logout: () => void;
  setSelectedSkin: (skin: Skin) => void;
  setProfileImage: (uri: string) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  markKeywordVisited: (keyword: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,
  selectedSkin: null,
  // 임시
  settings: {
    keywordCount: 3,
    notificationEnabled: true,
    notificationTime: "17:30",
  },
  visitedKeywords: [],

  login: (user, token) => set({ user, accessToken: token, isLoggedIn: true }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      selectedSkin: null,
    }),
  setSelectedSkin: (skin) => set({ selectedSkin: skin }),
  setProfileImage: (uri) =>
    set((state) => ({
      user: state.user ? { ...state.user, profileImage: uri } : null,
    })),
  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  markKeywordVisited: (keyword: string) =>
    set((state) =>
      state.visitedKeywords.includes(keyword)
        ? state
        : { visitedKeywords: [...state.visitedKeywords, keyword] }
    ),
}));
