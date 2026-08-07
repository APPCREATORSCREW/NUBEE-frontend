import { api } from "./client";
import { AxiosError } from "axios";

export interface NewsItem {
  newsId: number;
  title: string;
  imageUrl: string;
  viewedAt: string;
}

export interface NewsHistoryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    category: string;
    news: NewsItem[];
  };
}

export interface CategoryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    categories: string[];
  };
}

export const getCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await api.get<CategoryResponse>(
      "/api/news/categories"
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;

    throw new Error(
      err.response?.data?.message ??
      "카테고리를 불러오는데 실패했습니다."
    );
  }
};

export const getNewsHistory = async (
  category: string,
  page = 0,
  size = 20
): Promise<NewsHistoryResponse> => {
  try {
    const response = await api.get<NewsHistoryResponse>(
      "/api/news/history",
      {
        params: {
          category,
          page,
          size,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status;

    if (status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해 주세요.");
    }

    throw new Error(
      err.response?.data?.message ??
        "복습 목록을 불러오는데 실패했습니다."
    );
  }
};