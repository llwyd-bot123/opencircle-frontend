import axiosInstance from "@src/shared/api/axios";
import type { OrganizationMembersResponse, MemberRequestsResponse } from "../schema/member.types";
import { objectToFormData } from "@src/shared/utils/formDataConverter";

// Fetch organization members
export const getOrganizationMembers = async (
  organizationId: number
): Promise<OrganizationMembersResponse> => {
  const response = await axiosInstance.get<OrganizationMembersResponse>(
    `/organization/organization-members?organization_id=${organizationId}`
  );
  
  return response.data;
};

// Fetch pending member requests
export const getMemberRequests = async (): Promise<MemberRequestsResponse> => {
  const response = await axiosInstance.get<MemberRequestsResponse>(
    "/organization/pending-applications"
  );
  
  return response.data;
};

// Update a member request status
export const updateMemberRequestStatus = async (
  userId: number,
  status: "approved" | "rejected"
): Promise<{ success: boolean; message?: string }> => {
  const formData = objectToFormData({
    user_id: userId,
    status
  });
  
  const response = await axiosInstance.put(
    "/organization/membership/status/",
    formData
  );
  
  return response.data;
};