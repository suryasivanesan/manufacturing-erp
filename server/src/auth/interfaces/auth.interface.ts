export interface JwtPayload {
  sub: string;
  email: string;
  username?: string | null;
  role: string;
  department: string;
  designation: string;
  companyId: string;
  iat?: number;
  exp?: number;
}

export interface UserSummary {
  id: string;
  employeeCode?: string | null;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  department: string;
  designation: string;
  companyId?: string | null;
  company?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}
