import { useMutation } from "@tanstack/react-query";
import {
  registerMember,
  registerOrganization,
  type MemberLoginResponse,
  type OrganizationLoginResponse,
} from "../lib/signup.api";
import type {
  MemberSignupFormData,
  OrganizationSignupFormData,
} from "../schema/signup.schema";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

/**
 * Hook for organization registration using TanStack Query
 */
export const useOrganizationSignup = () => {
  return useMutation<
    OrganizationLoginResponse,
    Error,
    OrganizationSignupFormData
  >({
    mutationFn: (organizationData) => registerOrganization(organizationData),
    onSuccess: () => {
      showSuccessToast("Successfully signed up");
    },
    onError: (error) => {
      console.error("Organization registration error:", error);
      showErrorToast("Failed to sign up");
    },
  });
};

/**
 * Hook for member registration using TanStack Query
 */
export const useMemberSignup = () => {
  return useMutation<MemberLoginResponse, Error, MemberSignupFormData>({
    mutationFn: (memberData) => registerMember(memberData),
    onSuccess: () => {
      showSuccessToast("Successfully signed up");
    },
    onError: (error) => {
      console.error("Member registration error:", error);
      showErrorToast("Failed to sign up");
    },
  });
};
