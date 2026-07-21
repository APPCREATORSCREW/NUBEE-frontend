import { api } from "./client";

// GET/PATCH /api/users/settings 공용 바디 (키워드 개수 최대 6개, 알림 시간)
interface SettingsPayload {
  preferredKeywordCount: number;
  notificationEnabled: boolean;
  notificationTime: string;
}

// GET /api/users/settings - 학습 설정 조회
export const getSettings = async () => {
  const { data } = await api.get<SettingsPayload>("/api/users/settings");
  return data;
};

// PATCH /api/users/settings - 학습 설정 수정
export const updateSettings = async (payload: SettingsPayload) => {
  const { data } = await api.patch<SettingsPayload>(
    "/api/users/settings",
    payload,
  );
  return data;
};
