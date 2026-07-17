import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // 방문한 키워드만 영속화 (로그인 상태 등은 유지 대상 아님)
      partialize: (state) => ({ visitedKeywords: state.visitedKeywords }),
    }
  )
);
