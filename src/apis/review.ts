import { api } from "./client";
import { useUserStore } from "../store/useUserStore";

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

export const getNewsHistory = async (
  category: string,
  page = 0,
  size = 20
): Promise<NewsHistoryResponse> => {
  const accessToken = useUserStore.getState().accessToken;

  const response = await api.get<NewsHistoryResponse>(
    "/api/news/history",
    {
      params: {
        category,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};