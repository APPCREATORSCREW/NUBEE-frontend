import { api } from "./client";

// 보유 스킨 하나의 정보 (owned: 잠금 해제 여부)
interface Skin {
  imageUrl: string;
  owned: boolean;
  skinId: number;
  skinName: string;
}

// GET /api/users/profile 응답의 result
interface ProfileResult {
  username: string;
  email: string;
  currentLevel: number;
  currentStreak: number;
  currentPoint: number;
  profileImageUrl: string | null;
  currentSkinId: number;
  currentSkinName: string;
  skins: Skin[];
}

interface ProfileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ProfileResult;
}

// GET /api/users/profile - 프로필 조회
export const getProfile = async () => {
  const { data } = await api.get<ProfileResponse>("/api/users/profile");
  return data.result;
};

// PATCH /api/users/profile-image - 프로필 이미지 변경
// S3 presigned URL로 직접 업로드 끝난 뒤 최종 URL을 서버에 저장 요청하는 단계
// (실제 파일 업로드는 s3API.ts의 uploadToS3가 담당, 여기선 URL만 전달)
export const updateProfileImage = async (profileImageUrl: string) => {
  const { data } = await api.patch<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: { profileImage: string };
  }>("/api/users/profile-image", { profileImageUrl });
  return data.result;
};

// PATCH /api/users/skin - 스킨 적용 (보유한 스킨 중에서만 선택 가능, User.currentSkinId 갱신)
// useSkinStore의 Skin.apiId 넘기기
export const applySkin = async (skinId: number) => {
  const { data } = await api.patch<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: { currentSkinId: number };
  }>("/api/users/skin", { skinId });
  return data.result;
};

// PATCH /auth/password - 비밀번호 변경 (프로필 탭에서, 로그인된 상태로 변경)
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export const changePassword = async (payload: ChangePasswordRequest) => {
  const { data } = await api.patch<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
  }>("/auth/password", payload);
  return data.result;
};

// POST /auth/logout - refresh_token 폐기 (revoked_at 갱신)
interface LogoutRequest {
  refreshToken: string;
}

export const logoutAPI = async (payload: LogoutRequest) => {
  const { data } = await api.post<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
  }>("/auth/logout", payload);
  return data.result;
};
