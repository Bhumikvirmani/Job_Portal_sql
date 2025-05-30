const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const USER_API_END_POINT = `${backendBaseUrl}/api/v1/user`;
export const JOB_API_END_POINT = `${backendBaseUrl}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${backendBaseUrl}/api/v1/application`;
export const COMPANY_API_END_POINT = `${backendBaseUrl}/api/v1/company`;
