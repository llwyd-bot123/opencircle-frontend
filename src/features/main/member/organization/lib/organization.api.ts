import axiosInstance from "@src/shared/api/axios";
import type {
  OrganizationMembershipsResponse,
  PendingOrganizationMembershipsResponse,
} from "../schema/organization.types";

// Fetch all organizations that the member has joined along with their members
export const getOrganizationMemberships = async (
  accountUuid: string
): Promise<OrganizationMembershipsResponse> => {
  try {
    const response = await axiosInstance.get<OrganizationMembershipsResponse>(
      `/organization/memberships?account_uuid=${accountUuid}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch organization memberships:", error);
    throw error;
  }
};

// Leave an organization
export const leaveOrganization = async (
  organizationId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post("/organization/leave", {
      organization_id: organizationId,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to leave organization:", error);
    throw error;
  }
};

// Fetch all pending organization memberships for the member
export const getPendingOrganizationMemberships = async (
  accountUuid: string
): Promise<PendingOrganizationMembershipsResponse> => {
  try {
    const response =
      await axiosInstance.get<PendingOrganizationMembershipsResponse>(
        `/organization/pending-membership?account_uuid=${accountUuid}`
      );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch pending organization memberships:", error);
    throw error;
  }
};
