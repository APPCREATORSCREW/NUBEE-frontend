import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenStorage } from "../utils/tokenStorage";

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
  refreshToken: string | null;
  isLoggedIn: boolean;
  selectedSkin: Skin | null;
  settings: UserSettings;
  visitedKeywords: number[];
  quizAnswers: Record<number, number>;

  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  setSelectedSkin: (skin: Skin) => void;
  setProfileImage: (uri: string) => void;
  updateUser: (partial: Partial<User>) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  markKeywordVisited: (keyword: number) => void;
  answerQuiz: (keyword: number, optionIndex: number) => void;
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
      selectedSkin: null,
      // 임시
      settings: {
        keywordCount: 3,
        notificationEnabled: true,
        notificationTime: "17:30",
      },
      visitedKeywords: [],
      quizAnswers: {},

      // 로그인 성공 응답을 그대로 받아서 세팅 (accessToken은 메모리에만, refresh token은 tokenStorage 별도 관리)
      login: (user, token) =>
        set({ user, accessToken: token, isLoggedIn: true }),
      // 서버 refresh_token 폐기 API 호출은 별개(로그아웃 화면 담당) - 여기선 로컬 정리만 담당
      logout: async () => {
        await tokenStorage.removeRefreshToken();
        set({
          user: null,
          accessToken: null,
          isLoggedIn: false,
          selectedSkin: null,
        });
      },
      setSelectedSkin: (skin) => set({ selectedSkin: skin }),
      setProfileImage: (uri) =>
        set((state) => ({
          user: state.user ? { ...state.user, profileImage: uri } : null,
        })),
      // 서버 응답 등으로 유저 정보를 갱신할 때 사용.
      // 로그인 화면이 accessToken만 저장하고 user 객체는 안 만들어주기 때문에
      // user가 아직 null이어도(로그인 직후 최초 프로필 조회 등) partial로 새로 만들어줌
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
      answerQuiz: (keyword, optionIndex) =>
        set((state) =>
          state.quizAnswers[keyword] !== undefined
            ? state
            : { quizAnswers: { ...state.quizAnswers, [keyword]: optionIndex } },
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
      // 방문한 키워드/키워드 설정/퀴즈 응답만 영속화 (로그인 상태 등은 유지 대상 아님)
      partialize: (state) => ({
        visitedKeywords: state.visitedKeywords,
        settings: state.settings,
        quizAnswers: state.quizAnswers,
      }),
    },
  ),
);
