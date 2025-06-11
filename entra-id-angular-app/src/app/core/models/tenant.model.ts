import { UserInfo } from './user.model';

export interface TenantInfo {
  tenantId: string;
  displayName: string;
  verifiedDomains: string[];
  totalUsers: number;
  totalGroups: number;
  recentUsers: UserInfo[];
  groups: GroupInfo[];
  recentLoginAttempts: LoginAttempt[];
}

export interface GroupInfo {
  id: string;
  displayName: string;
  description: string;
  memberCount: number;
  createdDateTime: Date;
}

export interface LoginAttempt {
  userId: string;
  userDisplayName: string;
  userPrincipalName: string;
  createdDateTime: Date;
  status: string;
  ipAddress: string;
  location: string;
  clientAppUsed: string;
}