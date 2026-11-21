export interface UserPayload {
  id: string;
  employeeCode?: string | null;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  department?: string;
  designation?: string;
  specializedSector?: string;
  specializedRole?: string;
  companyId: string;
  industryCategory?: string;
  subCategory?: string;
  company?: {
    id: string;
    name: string;
    code: string;
    gstNumber?: string;
    industryCategory?: string;
    subCategory?: string;
    defaultUnit?: string;
  } | null;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserPayload;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
