import axios from "axios";
import { useUserStore } from "../store/useUserStore";

export const api = axios.create({
    // 임시 주소
    baseURL : 'http://10.0.2.2:8081',
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

