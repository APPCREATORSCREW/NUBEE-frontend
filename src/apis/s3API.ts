import { api } from "./client";

interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
  contentLength: number;
}

interface PresignedUrlResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { uploadUrl: string; fileUrl: string };
}

// POST /api/users/profile-image/presigned-url - S3 업로드용 presigned URL 발급
// contentType/contentLength는 실제 업로드할 파일과 정확히 일치해야 함
// S3 presigned URL 서명에 포함되는 값이라 안 맞으면 업로드 시 서명 검증 실패
export const getPresignedUrl = async ({
  fileName,
  contentType,
  contentLength,
}: PresignedUrlRequest) => {
  const { data } = await api.post<PresignedUrlResponse>(
    "/api/users/profile-image/presigned-url",
    { fileName, contentType, contentLength },
  );
  return data.result;
};

// presigned URL로 파일을 S3에 직접 PUT 업로드
// presigned URL은 쿼리스트링에 자체 서명이 포함돼있어서 client.ts의
// Authorization 헤더 interceptor가 끼면 S3 서명 검증과 충돌할 수 있음
export const uploadToS3 = async (
  uploadUrl: string,
  blob: Blob,
  contentType: string,
) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: { "Content-Type": contentType },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`S3 업로드 실패 (${response.status}): ${text}`);
  }
};
