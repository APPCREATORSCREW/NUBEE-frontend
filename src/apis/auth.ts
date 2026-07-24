import { api } from "./client";

// 회원가입
export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
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


// 회원가입 및 카카오 로그인 후 생년월일 저장
export interface BirthDateRequest {
    birthDate: string;
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
    const response = await api.patch<BirthDateResponse>(`/auth/birthdate`, data,);
    return response.data;
}

// 부모님 이메일 인증 코드 보내기 - 만 14세 미만인 경우
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
    const response = await api.post<ParentEmailSendResponse>(`/auth/parent/email/send`, data);
    return response.data;
}

// 부모님 이메일 인증 확인 - 만 14세 미만인 경우
export interface ParentEmailVerifyRequest {
    parentEmail: string;
    code: string;
}

export interface ParentEmailVerifyResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: string;
}

export const ParentEmailVerifyAPI = async (data: ParentEmailVerifyRequest): Promise<ParentEmailVerifyResponse> => {
    const response = await api.post<ParentEmailVerifyResponse>(`/auth/parent/email/verify`, data);
    return response.data;
}

// 튜토리얼 이후 학습 키워드 개수 설정
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

// 비밀번호 찾기 - 이메일 인증 발송
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
    const response = await api.post<PasswordResetResponse>(`/auth/password/reset`, data);
    return response.data;
}

// 비밀번호 찾기 - 인증번호 확인
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
    const response = await api.post<PasswordResetVerifyResponse>(`/auth/password/reset/verify`, data);
    return response.data;
}

// 비밀번호 재설정 - 로그인 과정
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

