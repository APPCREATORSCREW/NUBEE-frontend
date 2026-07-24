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
// uri: expo-image-picker가 반환하는 로컬 파일 경로, 서버 응답 필드명인 imageUrl과는 무관,
// RN FormData가 파일을 업로드할 때 요구하는 고정 키 이름
export const updateProfileImage = async (uri: string) => {
  const formData = new FormData();
  formData.append("image", {
    uri,
    name: "profile.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  // Content-Type을 수동으로 지정하면 boundary가 빠져서 서버가 파싱 못 할 수 있음
  // (500 에러 원인) - axios/RN이 FormData를 보고 자동으로 boundary 포함 헤더를 붙이게 둠
  const { data } = await api.patch<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: { profileImage: string };
  }>("/api/users/profile-image", formData);
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
