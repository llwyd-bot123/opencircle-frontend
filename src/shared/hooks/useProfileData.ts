import type {
  Member,
  Organization,
} from "@src/features/auth/schema/auth.types";

import avatarImage from "@src/assets/shared/avatar.png";
import { useImageUrl } from "./useImageUrl";
import { isMember, isOrganization } from "@src/shared/utils/checkAuthenticatedRole";

/**
 * Type for the profile data that can be either Member or Organization
 */
export type ProfileData =
  | Member
  | Organization
  | {
      name: string;
      role: string;
      role_id?: number;
      email?: string;
      bio?: string;
      avatarUrl?: string;
    };

// Type guard functions for ProfileData type (which can include custom profile objects)
export const isMemberType = (profile: ProfileData): profile is Member =>
  "first_name" in profile && "last_name" in profile;

export const isOrganizationType = (
  profile: ProfileData
): profile is Organization => "description" in profile && "name" in profile;

/**
 * Custom hook for handling profile data operations
 * @param profile - The profile data object (Member, Organization, or custom profile)
 * @returns Object containing utility functions for profile data
 */
export function useProfileData(profile: ProfileData | null | undefined) {
  const { getImageUrl: generateImageUrl } = useImageUrl();

  // Determine if the profile is a Member or Organization using shared type guards
  const isMemberProfile = profile ? isMember(profile as Member | Organization | null) : false;
  const isOrganizationProfile = profile ? isOrganization(profile as Member | Organization | null) : false;

  /**
   * Get the display name based on profile type
   */
  const getName = () => {
    if (!profile) return "Unknown";

    if (isMemberProfile && isMemberType(profile)) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (isOrganizationProfile && isOrganizationType(profile)) {
      return profile.name;
    }
    // For custom profile object
    return "name" in profile ? profile.name : "Unknown";
  };

  /**
   * Get the role or category based on profile type
   */
  const getRole = () => {
    if (!profile) return "";

    if (isMemberProfile) {
      return "Member";
    } else if (isOrganizationProfile && isOrganizationType(profile)) {
      return `Organization | ${profile.category}`;
    }
    // For custom profile object
    return "role" in profile ? profile.role : "";
  };

  /**
   * Get the bio or description based on profile type
   */
  const getBio = () => {
    if (!profile) return "";

    if (isMemberProfile && isMemberType(profile)) {
      return profile.bio;
    } else if (isOrganizationProfile && isOrganizationType(profile)) {
      return profile.description;
    }
    // For custom profile object
    return "bio" in profile ? profile.bio : "";
  };

  /**
   * Get the profile image URL based on profile type
   */
  const getImageUrl = () => {
    if (!profile) return avatarImage;
    
    if (isMemberProfile && isMemberType(profile) && profile.profile_picture) {
      const pic = profile.profile_picture;
      return generateImageUrl(pic.directory, pic.filename, avatarImage);
    } else if (isOrganizationProfile && isOrganizationType(profile) && profile.logo) {
      const logo = profile.logo;
      return generateImageUrl(logo.directory, logo.filename, avatarImage);
    }
    // For custom profile object with avatarUrl
    return "avatarUrl" in profile && profile.avatarUrl ? profile.avatarUrl : avatarImage;
  };

  /**
   * Get the email if available
   */
  const getEmail = () => {
    if (!profile) return undefined;
    return "email" in profile ? profile.email : undefined;
  };

  return {
    isMember: isMemberProfile,
    isOrganization: isOrganizationProfile,
    getName,
    getRole,
    getBio,
    getImageUrl,
    getEmail,
  };
}
