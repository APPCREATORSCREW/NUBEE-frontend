import { create } from "zustand";
import type { ImageSourcePropType } from "react-native";

export interface Skin {
  id: string;
  // 서버 API 요청에 사용하는 숫자 skinId
  apiId: number;
  name: string;
  image: ImageSourcePropType;
  owned: boolean;
  requiredLevel: number;
}

export interface ServerSkin {
  imageUrl: string | null;
  owned: boolean;
  skinId: number;
  skinName: string;
}

const ORIGINAL_SKIN: Skin = {
  id: "1",
  apiId: 1,
  name: "기본 꿀벌",
  image: require("../../assets/skins/skin_origin.png"),
  owned: true,
  requiredLevel: 1,
};

const getRequiredLevel = (skinId: number) =>
  skinId === 1 ? 1 : skinId * 5 - 5;

const mapServerSkin = (skin: ServerSkin): Skin => ({
  id: String(skin.skinId),
  apiId: skin.skinId,
  name: skin.skinName,
  image: skin.imageUrl ? { uri: skin.imageUrl } : ORIGINAL_SKIN.image,
  owned: skin.owned,
  requiredLevel: getRequiredLevel(skin.skinId),
});

interface SkinState {
  skins: Skin[];
  selectedSkinId: string;
  setSkins: (skins: ServerSkin[], currentSkinId: number) => void;
  selectSkin: (skinId: string) => void;
}

export const useSkinStore = create<SkinState>((set, get) => ({
  // 기본 스킨
  skins: [ORIGINAL_SKIN],
  selectedSkinId: ORIGINAL_SKIN.id,

  // GET /api/users/profile
  setSkins: (serverSkins, currentSkinId) => {
    const skins = serverSkins.map(mapServerSkin);
    const selectedSkinId = skins.some((skin) => skin.apiId === currentSkinId)
      ? String(currentSkinId)
      : skins[0]?.id ?? ORIGINAL_SKIN.id;

    set({
      skins: skins.length > 0 ? skins : [ORIGINAL_SKIN],
      selectedSkinId,
    });
  },

  selectSkin: (skinId) => {
    const skin = get().skins.find((item) => item.id === skinId);
    if (!skin?.owned) return;
    set({ selectedSkinId: skinId });
  },
}));

export const getSkinById = (skinId: string): Skin =>
  useSkinStore.getState().skins.find((skin) => skin.id === skinId) ??
  ORIGINAL_SKIN;
