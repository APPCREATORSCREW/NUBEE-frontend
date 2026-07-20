import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

export interface Skin {
  id: string;
  apiId: number; // TODO: 백엔드 실제 skinId로 확인 후 교체. 지금은 프론트 배열 순서대로 1~12 임시 배정 (origin=1만 확인됨)
  name: string;
  image: ImageSourcePropType;
  requiredLevel: number;
}

// 레벨 5단위로 해금
// 오리지널 > 천사 > 엘리트 > 악마 > 베이비 > 공룡 > 마법사 > 블록 > 갸루 > 네모 > 파이어 > 홀로그램
export const SKINS: Skin[] = [
  {
    id: 'origin',
    apiId: 1,
    name: '오리지널',
    image: require('../../assets/skins/skin_origin.png'),
    requiredLevel: 1,
  },
  {
    id: 'angel',
    apiId: 2,
    name: '천사',
    image: require('../../assets/skins/skin_angel.png'),
    requiredLevel: 5,
  },
  {
    id: 'elite',
    apiId: 3,
    name: '엘리트',
    image: require('../../assets/skins/skin_elite.png'),
    requiredLevel: 10,
  },
  {
    id: 'devil',
    apiId: 4,
    name: '악마',
    image: require('../../assets/skins/skin_devil.png'),
    requiredLevel: 15,
  },
  {
    id: 'baby',
    apiId: 5,
    name: '베이비',
    image: require('../../assets/skins/skin_baby.png'),
    requiredLevel: 20,
  },
  {
    id: 'dino',
    apiId: 6,
    name: '공룡',
    image: require('../../assets/skins/skin_dino.png'),
    requiredLevel: 25,
  },
  {
    id: 'wizard',
    apiId: 7,
    name: '마법사',
    image: require('../../assets/skins/skin_wizard.png'),
    requiredLevel: 30,
  },
  {
    id: 'block',
    apiId: 8,
    name: '블록',
    image: require('../../assets/skins/skin_block.png'),
    requiredLevel: 35,
  },
  {
    id: 'gyaru',
    apiId: 9,
    name: '갸루',
    image: require('../../assets/skins/skin_gyaru.png'),
    requiredLevel: 40,
  },
  {
    id: 'square',
    apiId: 10,
    name: '네모',
    image: require('../../assets/skins/skin_square.png'),
    requiredLevel: 45,
  },
  {
    id: 'fire',
    apiId: 11,
    name: '파이어',
    image: require('../../assets/skins/skin_fire.png'),
    requiredLevel: 50,
  },
  {
    id: 'hologram',
    apiId: 12,
    name: '홀로그램',
    image: require('../../assets/skins/skin_hologram.png'),
    requiredLevel: 55,
  },
];

const DEFAULT_SKIN_ID = SKINS[0].id;

export const getSkinById = (skinId: string): Skin =>
  SKINS.find((skin) => skin.id === skinId) ?? SKINS[0];

// 서버 응답의 숫자 skinId(apiId 기준)로 로컬 스킨을 찾을 때 사용 (예: 프로필 조회 응답의 currentSkinId)
export const getSkinByApiId = (apiId: number): Skin | undefined =>
  SKINS.find((skin) => skin.apiId === apiId);

export const isSkinUnlocked = (skinId: string, level: number): boolean =>
  getSkinById(skinId).requiredLevel <= level;

export const getUnlockedSkins = (level: number): Skin[] =>
  SKINS.filter((skin) => skin.requiredLevel <= level);

interface SkinState {
  level: number;
  selectedSkinId: string;
  setLevel: (level: number) => void;
  selectSkin: (skinId: string) => void;
}

export const useSkinStore = create<SkinState>()(
  persist(
    (set, get) => ({
      // 연동 테스트용 임시값 여기에 작성
      level: 32,
      selectedSkinId: 'wizard',

      setLevel: (level: number) => set({ level }),

      selectSkin: (skinId: string) => {
        const { level } = get();
        if (!isSkinUnlocked(skinId, level)) return;
        set({ selectedSkinId: skinId });
      },
    }),
    {
      name: 'skin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
