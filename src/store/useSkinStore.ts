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
// 임시 순서: 오리지널 > 용사 > 마인크래프트 > 천사 > 로블록스 > 악마 > 갸루 
export const SKINS: Skin[] = [
  {
    id: 'origin',
    name: '오리지널',
    image: require('../../assets/skins/skin_origin.png'),
    requiredLevel: 1,
  },
  {
    id: 'brave',
    name: '용사',
    image: require('../../assets/skins/temp/skin_brave.png'),
    requiredLevel: 5,
  },
  {
    id: 'minecraft',
    name: '마인크래프트',
    image: require('../../assets/skins/temp/skin_minecraft.png'),
    requiredLevel: 10,
  },
  {
    id: 'angel',
    name: '천사',
    image: require('../../assets/skins/temp/skin_angel.png'),
    requiredLevel: 15,
  },
  {
    id: 'roblox',
    name: '로블록스',
    image: require('../../assets/skins/temp/skin_roblox.png'),
    requiredLevel: 20,
  },
  {
    id: 'devil',
    name: '악마',
    image: require('../../assets/skins/temp/skin_devil.png'),
    requiredLevel: 25,
  },
  {
    id: 'gyaru',
    name: '갸루',
    image: require('../../assets/skins/temp/skin_gyaru.png'),
    requiredLevel: 30,
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
      selectedSkinId: 'minecraft',

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
