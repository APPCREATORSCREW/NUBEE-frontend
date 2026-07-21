import * as SecureStore from 'expo-secure-store';

// 단기 토큰인 Access token은 Zustand 전용 메모리 상에만 저장
// 장기 토큰인 Refresh token만 SecureStore에 저장

const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
  async saveRefreshToken(token: string):  Promise<boolean> {
    try{
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);    
        return true;
    }catch (error) {
        console.error('SecureStore 토큰 저장 실패:', error);
        return false;
    }
  },
async getRefreshToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      return token; 
    } catch (error) {
      console.error('SecureStore 토큰 조회 실패:', error);
      return null;
    }
  },

  async removeRefreshToken(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      return true; 
    } catch (error) {
      console.error('SecureStore 토큰 삭제 실패:', error);
      return false;
    }
  },
};