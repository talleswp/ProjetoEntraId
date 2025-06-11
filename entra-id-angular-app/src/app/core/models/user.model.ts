export interface UserInfo {
  id: string;
  displayName: string;
  email: string;
  tenantId: string;
  jobTitle: string;
  department: string;
  lastSignInDateTime?: Date;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  claims: { type: string; value: string }[];
}

export interface MsalUser {
  name?: string;
  username?: string;
  localAccountId: string;
  tenantId?: string;
  environment: string;
}