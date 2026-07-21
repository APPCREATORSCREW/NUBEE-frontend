import { api } from "./client";

// 회원가입
export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    birthDate: string;
    preferredKeywordCount: number;
    parentEmail: string | null;
}

export interface SignUpResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        accessToken: string;
        refreshToken: string;
    }
}

export const SignUpAPI = async (data: SignUpRequest): Promise<SignUpResponse> => {
    // 노션 상 url 불일치
    const response = await api.post<SignUpResponse>(`/auth/signup`, data);
    return response.data;
}

// 로그인
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        accessToken: string;
        refreshToken: string;
    }
}

export const LoginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`/auth/login`, data);
    return response.data;
}

// 카카오 - 생년월일
export interface BirthDateRequest {
    birthDate: string
}

export interface BirthDateResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        under14: boolean;
    }
}

export const BirthDateAPI = async (data: BirthDateRequest): Promise<BirthDateResponse> => {
    const response = await api.patch<BirthDateResponse>(`/auth/kakao/birthdate`, data,);
    return response.data;
}

// 부모님 이메일 send
export interface ParentEmailSendRequest {
    parentEmail: string
}

export interface ParentEmailSendResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const ParentEmailSendAPI = async (data: ParentEmailSendRequest): Promise<ParentEmailSendResponse> => {
    // 노션 상 url 불일치
    const response = await api.post<ParentEmailSendResponse>(`/auth/parent/email/send`, data);
    return response.data;
}

// 부모님 이메일 verify
export interface ParentEmailVerifyRequest {
    email: string;
    code: string;
}

export interface ParentEmailVerifyResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const ParentEmailVerifyAPI = async (data: ParentEmailVerifyRequest): Promise<ParentEmailVerifyResponse> => {
    // 노션 상 url 불일치
    const response = await api.post<ParentEmailVerifyResponse>(`/auth/parent/email/verify`, data);
    return response.data;
}

// 키워드 개수
export interface KeywordCountRequest {
    preferredKeywordCount: number;
}

export interface KeywordCountResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const KeywordCountAPI = async (data: KeywordCountRequest): Promise<KeywordCountResponse> => {
    const response = await api.patch<KeywordCountResponse>(`/auth/keyword-count`, data);
    return response.data;
}

// 비밀번호 찾기 - 이메일
export interface PasswordResetRequest {
    username: string;
    email: string;
}

export interface PasswordResetResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const PasswordResetAPI = async (data: PasswordResetRequest): Promise<PasswordResetResponse> => {
    // 노션 상 url 불일치
    const response = await api.post<PasswordResetResponse>(`/auth/password/reset`, data);
    return response.data;
}

// 비밀번호 찾기 - verify
export interface PasswordResetVerifyRequest {
    email: string;
    code: string;
}

export interface PasswordResetVerifyResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const PasswordResetVerifyAPI = async (data: PasswordResetVerifyRequest): Promise<PasswordResetVerifyResponse> => {
    // 노션 상 url 불일치
    const response = await api.post<PasswordResetVerifyResponse>(`/auth/password/reset/verify`, data);
    return response.data;
}

// 비밀번호 재설정
export interface PasswordResetConfirmRequest {
    email: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export interface PasswordResetConfirmResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const PasswordResetConfirmAPI = async (data: PasswordResetConfirmRequest): Promise<PasswordResetConfirmResponse> => {
    // 노션 상 url 불일치
    const response = await api.patch<PasswordResetConfirmResponse>(`/auth/password/reset/confirm`, data);
    return response.data;
}

// 토큰 갱신
export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        accessToken: string;
        refreshToken: string;
    }
}

export const RefreshAPI = async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>(`/auth/token/refresh`, data);
    return response.data;
}


