// User profile picture type
export type ProfilePicture = {
  id: number;
  directory: string;
  filename: string;
};

// Authenticated member user type
export type Member = {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  profile_picture: ProfilePicture;
  uuid: string;
  role_id: number; // Role ID for RBAC (1 = member)
};

// Authenticated organization user type
export type Organization = {
  id: number;
  account_id: number;
  name: string;
  email: string;
  logo: ProfilePicture;
  category: string;
  description: string;
  uuid: string;
  role_id: number; // Role ID for RBAC (2 = organization)
};

// Authenticated user (either Member or Organization)
export type User = Member | Organization;

// Role ID to role name mapping
export enum RoleId {
  Member = 1,
  Organization = 2,
}

// Role name type
export type RoleName = "member" | "organization";

// Member login response type
export type MemberLoginResponse = {
  user: Member;
  expires_at: string;
};

// Organization login response type
export type OrganizationLoginResponse = {
  organization: Organization;
  expires_at: string;
};

// Authentication state type
export type AuthState = {
  user: User | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  login: (userData: MemberLoginResponse | OrganizationLoginResponse) => void;
  logout: () => void;
};
