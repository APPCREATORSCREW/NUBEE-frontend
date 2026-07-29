import { api } from "./client";

// 오늘의 키워드 리스트 조회
export interface MainKeyword {
    id: number;
    word: string;
    explanation: string;
    example_sentence: string;
    keyword_type: string;
}

export interface NewsItem {
    id: number;
    category: string;
    title: string;
    summary: string;
    image_url: string;
    main_keyword: MainKeyword;
}

export interface KeywordsResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        total_count: number;
        news_list: NewsItem[];
    };
}

export const KeywordsAPI = async (): Promise<KeywordsResponse> => {
    const response = await api.get<KeywordsResponse>(`/api/keywords`);
    return response.data;
}

// 특정 키워드 설명 조회
export interface KeywordIdResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: MainKeyword;
}

export const KeywordExplanationAPI = async (keyword_id: number): Promise<KeywordIdResponse> => {
    const response = await api.get<KeywordIdResponse>(`/api/keywords/${keyword_id}`);
    return response.data;
}

// 특정 키워드 퀴즈 조회
export interface KeywordQuizOption {
    option_number: number;
    option_text: string;
}

export interface KeywordQuiz {
    id: number;
    new_id: number;
    keyword_id: number;
    quiz_type: string;
    question: string;
    options: KeywordQuizOption[];
}

export interface KeywordQuizResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: KeywordQuiz;
}

export const KeywordQuizAPI = async (keyword_id: number): Promise<KeywordQuizResponse> => {
    const response = await api.get<KeywordQuizResponse>(`/api/keywords/${keyword_id}/quiz`);
    return response.data;
}

// 키워드 퀴즈 채점 및 포인트 지급
export interface KeywordSubmitRequest {
    quiz_id: number;
    selected_answer: number;
}

export interface KeywordSubmit {
    quiz_id: number;
    selected_answer: number;
    correct_answer: number;
    is_correct: boolean;
    explanation: string;
    is_completed: boolean;
    point_result: {
        earned_point: number;
        current_point: number;
    };
}

export interface KeywordSubmitResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: KeywordSubmit;
}

export const KeywordSubmitAPI = async (keyword_id: number, data: KeywordSubmitRequest): Promise<KeywordSubmitResponse> => {
    const response = await api.post<KeywordSubmitResponse>(`/api/keywords/${keyword_id}/quiz/submit`, data);
    return response.data;
}

export interface LearnedKeyword {
    word: string;
    originalUrl: string;
}

export interface SendNewsResult {
    username: string;
    learnedKeywords: LearnedKeyword[];
    keywordQuizAccuracy: number;
    newsQuizAccuracy: number;
}

export interface SendNewsResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: SendNewsResult;
}

export const SendNewsAPI = async (): Promise<SendNewsResponse> => {
    const response = await api.get<SendNewsResponse>("/api/news/send");
    return response.data;
};