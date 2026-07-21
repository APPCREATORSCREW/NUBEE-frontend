import { api } from "./client";

// GET/PATCH /api/users/settings 공용 바디 (키워드 개수 최대 6개, 알림 시간)
interface SettingsResult {
  preferredKeywordCount: number;
  notificationEnabled: boolean;
  notificationTime: string;
}

interface SettingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SettingsResult;
}

// GET /api/users/settings - 학습 설정 조회
export const getSettings = async () => {
  const { data } = await api.get<SettingsResponse>("/api/users/settings");
  return data.result;
};

// PATCH /api/users/settings - 학습 설정 수정
export const updateSettings = async (payload: SettingsResult) => {
  const { data } = await api.patch<SettingsResponse>(
    "/api/users/settings",
    payload,
  );
  return data.result;
};
