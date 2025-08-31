export interface ProfilePicture {
  id: number;
  directory: string;
  filename: string;
}

export interface OrganizationMember {
  user_id: number;
  account_uuid: string;
  first_name: string;
  last_name: string;
  bio: string;
  status: "approved" | "pending";
  profile_picture: ProfilePicture;
}

export interface OrganizationMembership {
  organization_id: number;
  organization_name: string;
  membership_status: "approved" | "pending";
  members: OrganizationMember[];
}

export interface OrganizationMembershipsResponse {
  organizations: OrganizationMembership[];
}

// Interface for pending organization membership
export interface PendingOrganizationMembership {
  organization_id: number;
  organization_name: string;
  organization_category: string;
  organization_logo: ProfilePicture;
  membership_status: "pending";
}

// Response interface for pending organization memberships
export interface PendingOrganizationMembershipsResponse {
  pending_memberships: PendingOrganizationMembership[];
}

// Response interface for organization search
export interface OrganizationSearchResponse {
  results: DirectOrganizationSearchItem[];
}

// Interface for direct organization search result item
export interface DirectOrganizationSearchItem {
  organization_id: number;
  account_uuid: string;
  name: string;
  description: string;
  category: string;
  logo: ProfilePicture;
}

// Type for direct organization search response
export type DirectOrganizationSearchResponse = DirectOrganizationSearchItem[];
