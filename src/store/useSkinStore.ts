import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

export interface Skin {
  id: string;
  name: string;
  image: ImageSourcePropType;
  requiredLevel: number;
}

// 레벨 5단위로 해금
// 오리지널 > 천사 > 엘리트 > 악마 > 베이비 > 공룡 > 마법사 > 블록 > 갸루 > 네모 > 파이어 > 홀로그램
export const SKINS: Skin[] = [
  {
    id: 'origin',
    name: '오리지널',
    image: require('../../assets/skins/skin_origin.png'),
    requiredLevel: 1,
  },
  {
    id: 'angel',
    name: '천사',
    image: require('../../assets/skins/skin_angel.png'),
    requiredLevel: 5,
  },
  {
    id: 'elite',
    name: '엘리트',
    image: require('../../assets/skins/skin_elite.png'),
    requiredLevel: 10,
  },
  {
    id: 'devil',
    name: '악마',
    image: require('../../assets/skins/skin_devil.png'),
    requiredLevel: 15,
  },
  {
    id: 'baby',
    name: '베이비',
    image: require('../../assets/skins/skin_baby.png'),
    requiredLevel: 20,
  },
  {
    id: 'dino',
    name: '공룡',
    image: require('../../assets/skins/skin_dino.png'),
    requiredLevel: 25,
  },
  {
    id: 'wizard',
    name: '마법사',
    image: require('../../assets/skins/skin_wizard.png'),
    requiredLevel: 30,
  },
  {
    id: 'block',
    name: '블록',
    image: require('../../assets/skins/skin_block.png'),
    requiredLevel: 35,
  },
  {
    id: 'gyaru',
    name: '갸루',
    image: require('../../assets/skins/skin_gyaru.png'),
    requiredLevel: 40,
  },
  {
    id: 'square',
    name: '네모',
    image: require('../../assets/skins/skin_square.png'),
    requiredLevel: 45,
  },
  {
    id: 'fire',
    name: '파이어',
    image: require('../../assets/skins/skin_fire.png'),
    requiredLevel: 50,
  },
  {
    id: 'hologram',
    name: '홀로그램',
    image: require('../../assets/skins/skin_hologram.png'),
    requiredLevel: 55,
  },
];

const DEFAULT_SKIN_ID = SKINS[0].id;

export const getSkinById = (skinId: string): Skin =>
  SKINS.find((skin) => skin.id === skinId) ?? SKINS[0];

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
