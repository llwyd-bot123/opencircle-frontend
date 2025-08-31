import { useMutation } from "@tanstack/react-query";
import {
  loginMember,
  loginOrganization,
  logout,
  type LoginCredentials,
  type MemberLoginResponse,
  type OrganizationLoginResponse,
} from "../lib";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

/**
 * Hook for member login using TanStack Query
 */
export const useMemberLogin = () => {
  return useMutation<MemberLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginMember(credentials),
    onSuccess: () => {
      showSuccessToast("Successfully logged in");
    },
    onError: (error) => {
      console.error("Member login error:", error);
      showErrorToast("Failed to login");
    },
  });
};

/**
 * Hook for organization login using TanStack Query
 */
export const useOrganizationLogin = () => {
  return useMutation<OrganizationLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginOrganization(credentials),
    onSuccess: () => {
      showSuccessToast("Successfully logged in");
    },
    onError: (error) => {
      console.error("Organization login error:", error);
      showErrorToast("Failed to login");
    },
  });
};

// Removed deprecated useLogin hook

/**
 * Hook for logout using TanStack Query
 */
export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => logout(),
    onSuccess: () => {
      showSuccessToast("Successfully logged out");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      showErrorToast("Failed to logout");
    },
  });
};
