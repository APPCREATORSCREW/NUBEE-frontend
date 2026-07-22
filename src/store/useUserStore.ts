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
  quizAnswers: Record<string, number>;

  login: (user: User, token: string) => void;
  logout: () => void;
  setSelectedSkin: (skin: Skin) => void;
  setProfileImage: (uri: string) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  markKeywordVisited: (keyword: string) => void;
  answerQuiz: (keyword: string, optionIndex: number) => void;
  addPoints: (amount: number) => void;
  setAccessToken: (token: string) => void;
}

// 포인트 50 적립마다 레벨업
export const POINTS_PER_LEVEL = 50;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // 연동 테스트용 임시값 여기에 작성
      user: {
        id: "test-user",
        name: "눈송이",
        email: "nubee@example.com",
        level: 10,
        streak: 3,
        points: 32,
        profileImage: null,
        loginType: "email",
      },
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
      quizAnswers: {},

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
      answerQuiz: (keyword, optionIndex) =>
        set((state) =>
          state.quizAnswers[keyword] !== undefined
            ? state
            : { quizAnswers: { ...state.quizAnswers, [keyword]: optionIndex } }
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
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // 방문한 키워드/키워드 설정/퀴즈 응답만 영속화 (로그인 상태 등은 유지 대상 아님)
      partialize: (state) => ({
        visitedKeywords: state.visitedKeywords,
        settings: state.settings,
        quizAnswers: state.quizAnswers,
      }),
    }
  )
);
