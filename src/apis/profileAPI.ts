import { api } from "./client";

// 보유 스킨 하나의 정보 (owned: 잠금 해제 여부)
interface Skin {
  imageUrl: string;
  owned: boolean;
  skinId: number;
  skinName: string;
}

// GET /api/users/profile 응답 (result 기준)
interface ProfileResponse {
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

// GET /api/users/profile - 프로필 조회
export const getProfile = async () => {
  const { data } = await api.get<ProfileResponse>("/api/users/profile");
  return data;
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

  const { data } = await api.patch<{ profileImage: string }>(
    "/api/users/profile-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

// PATCH /api/users/skin - 스킨 적용 (보유한 스킨 중에서만 선택 가능, User.currentSkinId 갱신)
// useSkinStore의 Skin.apiId 넘기기
export const applySkin = async (skinId: number) => {
  const { data } = await api.patch<{ currentSkinId: number }>(
    "/api/users/skin",
    { skinId },
  );
  return data;
};
