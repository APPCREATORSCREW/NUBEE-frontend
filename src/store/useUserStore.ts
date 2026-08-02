import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenStorage } from "../utils/tokenStorage";
import type { KeywordSubmit } from "../apis/home";

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
  refreshToken: string | null;
  isLoggedIn: boolean;
  settings: UserSettings;
  visitedKeywords: number[];
  quizAnswers: Record<number, number>;
  quizResults: Record<number, KeywordSubmit>;
  newsQuizAnswers: Record<number, number>;

  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  setProfileImage: (uri: string) => void;
  updateUser: (partial: Partial<User>) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  markKeywordVisited: (keyword: number) => void;
  answerQuiz: (keyword: number, result: KeywordSubmit) => void;
  answerNewsQuiz: (newsId: number, optionIndex: number) => void;
  addPoints: (amount: number) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}

// 포인트 50 적립마다 레벨업
export const POINTS_PER_LEVEL = 50;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      settings: {
        keywordCount: 3,
        notificationEnabled: true,
        notificationTime: "17:30",
      },
      visitedKeywords: [],
      quizAnswers: {},
      quizResults: {},
      newsQuizAnswers: {},

      login: (user, token) =>
        set({ user, accessToken: token, isLoggedIn: true }),
      logout: async () => {
        await tokenStorage.removeRefreshToken();
        set({
          user: null,
          accessToken: null,
          isLoggedIn: false,
          visitedKeywords: [],
          quizAnswers: {},
          quizResults: {},
          newsQuizAnswers: {},
        });
      },
      setProfileImage: (uri) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, profileImage: uri }
            : {
                id: "",
                name: "",
                email: "",
                level: 0,
                streak: 0,
                points: 0,
                profileImage: uri,
                loginType: "email",
              },
        })),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...partial }
            : {
                id: "",
                name: "",
                email: "",
                level: 0,
                streak: 0,
                points: 0,
                profileImage: null,
                loginType: "email",
                ...partial,
              },
          isLoggedIn: true,
        })),
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      markKeywordVisited: (keyword: number) =>
        set((state) =>
          state.visitedKeywords.includes(keyword)
            ? state
            : { visitedKeywords: [...state.visitedKeywords, keyword] },
        ),
      answerQuiz: (keyword, result) =>
        set((state) =>
          state.quizAnswers[keyword] !== undefined
            ? state
            : {
                quizAnswers: { ...state.quizAnswers, [keyword]: result.selected_answer },
                quizResults: { ...state.quizResults, [keyword]: result },
              },
        ),
      answerNewsQuiz: (newsId, optionIndex) =>
        set((state) =>
          state.newsQuizAnswers[newsId] !== undefined
            ? state
            : { newsQuizAnswers: { ...state.newsQuizAnswers, [newsId]: optionIndex } },
        ),
      addPoints: (amount) =>
        set((state) => {
          if (!state.user) return state;
          let points = state.user.points + amount;
          let level = state.user.level;
          while (points >= POINTS_PER_LEVEL) {
            points -= POINTS_PER_LEVEL;
            level += 1;
          }
          return { user: { ...state.user, points, level } };
        }),

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        visitedKeywords: state.visitedKeywords,
        settings: state.settings,
        quizAnswers: state.quizAnswers,
        quizResults: state.quizResults,
        newsQuizAnswers: state.newsQuizAnswers,
      }),
    },
  ),
);
