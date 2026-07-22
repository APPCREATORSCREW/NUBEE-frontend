import { api } from './client';
import { AxiosError } from 'axios';

// 1. 오늘의 뉴스 상세 조회 (팝업용 단어 목록 포함)
export const getNewsDetail = async (newsId: number | string) => {
  try {
    const response = await api.get(`/api/news/${newsId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || "뉴스를 불러오는데 실패했습니다.");
  }
};

// 2. 뉴스 퀴즈 조회
export const getNewsQuiz = async (newsId: number | string) => {
  try {
    const response = await api.get(`/api/news/${newsId}/quiz`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || "퀴즈를 불러오는데 실패했습니다.");
  }
};

// 3. 뉴스 퀴즈 채점 및 포인트 지급
export const submitNewsQuiz = async (newsId: number | string, quizId: number, selectedAnswer: number) => {
  try {
    const response = await api.post(`/api/news/${newsId}/quiz`, {
      quiz_id: quizId,
      selected_answer: selectedAnswer,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || "퀴즈 제출에 실패했습니다.");
  }
};

// 4. 단어장에 키워드 추가
export const addKeywordToWordbook = async (keywordId: number | string) => {
  try {
    const response = await api.post(`/api/words/${keywordId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status;
    if (status === 400) {
      throw new Error("이미 단어장에 존재하는 단어입니다.");
    }
    throw new Error(err.response?.data?.message || "단어 추가에 실패했습니다.");
  }
};