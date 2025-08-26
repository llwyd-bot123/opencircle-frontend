import axiosInstance from "@src/shared/api/axios";
import { useAuthStore } from "@src/shared/store";
import type { MemberLoginResponse, OrganizationLoginResponse } from "@src/features/auth/schema/auth.types";
import { objectToFormData } from "@src/shared/utils/formDataConverter";

// Re-export types from auth.types.ts
export type { MemberLoginResponse, OrganizationLoginResponse };

// Login credentials type
export type LoginCredentials = {
  email: string;
  password: string;
};

// Union type for login response
export type LoginResponse = MemberLoginResponse | OrganizationLoginResponse;

// Authenticates a member user with credentials
export const loginMember = async (
  credentials: LoginCredentials
): Promise<MemberLoginResponse> => {
  try {
    const formData = objectToFormData(credentials);
    
    const response = await axiosInstance.post<MemberLoginResponse>(
      "/account/user_signin",
      formData
    );

    const authStore = useAuthStore.getState();
    authStore.login(response.data);

    return response.data;
  } catch (error) {
    console.error("Member login failed:", error);
    throw error;
  }
};

// Authenticates an organization with credentials
export const loginOrganization = async (
  credentials: LoginCredentials
): Promise<OrganizationLoginResponse> => {
  try {
    const formData = objectToFormData(credentials);
    
    const response = await axiosInstance.post<OrganizationLoginResponse>(
      "/account/organization_signin",
      formData
    );

    const authStore = useAuthStore.getState();
    authStore.login(response.data);

    return response.data;
  } catch (error) {
    console.error("Organization login failed:", error);
    throw error;
  }
};

// Logs out the current user
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/account/logout");
    
    const authStore = useAuthStore.getState();
    authStore.logout();
    
    return Promise.resolve();
  } catch (error) {
    console.error("Logout failed:", error);
    const authStore = useAuthStore.getState();
    authStore.logout();
    throw error;
  }
};
