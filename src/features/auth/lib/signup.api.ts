import axiosInstance from "@src/shared/api/axios";
// import { useAuthStore } from "@src/shared/store";
import type {
  MemberLoginResponse,
  OrganizationLoginResponse,
} from "@src/features/auth/schema/auth.types";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type {
  MemberSignupFormData,
  OrganizationSignupFormData,
} from "../schema/signup.schema";

// Re-export types from auth.types.ts
export type { MemberLoginResponse, OrganizationLoginResponse };

// Registers a new member with the provided data
export const registerMember = async (
  memberData: MemberSignupFormData
): Promise<MemberLoginResponse> => {
  try {
    const formData = objectToFormData(memberData, ["profile_picture"]);

    const response = await axiosInstance.post<MemberLoginResponse>(
      "/account/user",
      formData
    );

    // Authentication is handled separately after registration

    return response.data;
  } catch (error) {
    console.error("Member registration failed:", error);
    throw error;
  }
};

// Registers a new organization with the provided data
export const registerOrganization = async (
  organizationData: OrganizationSignupFormData
): Promise<OrganizationLoginResponse> => {
  try {
    const formData = objectToFormData(organizationData);

    const response = await axiosInstance.post<OrganizationLoginResponse>(
      "/account/organization",
      formData
    );

    // Authentication is handled separately after registration

    return response.data;
  } catch (error) {
    console.error("Organization registration failed:", error);
    throw error;
  }
};
