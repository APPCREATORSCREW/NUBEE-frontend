import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? '일시적인 오류가 발생했어요. 다시 시도해주세요.';
  }
  return '일시적인 오류가 발생했어요. 다시 시도해주세요.';
};