import { api } from './client';
import { useUserStore } from '../store/useUserStore';
import { AxiosError } from 'axios';


api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const addWordToBook = async (keywordId: number | string) => {
  try {
    const response = await api.post(`/api/words/${keywordId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status;
    
    if (status === 400) {
      throw new Error("이미 단어장에 존재하는 단어입니다.");
    } else if (status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해 주세요.");
    } else if (status === 404) {
      throw new Error("존재하지 않는 키워드입니다.");
    }
    throw new Error(err.response?.data?.message || "단어 추가에 실패했습니다.");
  }
};


export const getWordList = async () => {
  try {
    const response = await api.get('/api/words');
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status;
    
    if (status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해 주세요.");
    }
    throw new Error(err.response?.data?.message || "단어 리스트를 불러오는데 실패했습니다.");
  }
};


export const deleteWord = async (wordId: number | string) => {
  try {
    const response = await api.delete(`/api/words/${wordId}/delete`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status;
    
    if (status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해 주세요.");
    } else if (status === 404) {
      throw new Error("해당 단어를 찾을 수 없습니다.");
    }
    throw new Error(err.response?.data?.message || "단어 삭제에 실패했습니다.");
  }
};