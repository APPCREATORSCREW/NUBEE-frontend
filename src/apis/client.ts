import axios from "axios";
import { useUserStore } from "../store/useUserStore";
import { tokenStorage } from "../utils/tokenStorage";
import type { RefreshResponse } from "./auth";

export const api = axios.create({
    // 임시 주소
    baseURL : '임시 주소',
    timeout: 5000,
})

api.interceptors.request.use((config) => {
    const accessToken = useUserStore.getState().accessToken;

    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }
      try {

        const { data } = await axios.post<RefreshResponse>(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });        
        const result = data.result;

        useUserStore.getState().setAccessToken(result.accessToken);
        tokenStorage.saveRefreshToken(result.refreshToken);
        error.config.headers.Authorization = `Bearer ${result.accessToken}`

        return api(error.config);
      } catch (refreshError) {
        useUserStore.getState().logout();
        await tokenStorage.removeRefreshToken();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
