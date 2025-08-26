import { useMutation } from "@tanstack/react-query";
import { registerMember, registerOrganization, type MemberLoginResponse, type OrganizationLoginResponse } from "../lib/signup.api";
import type { MemberSignupFormData, OrganizationSignupFormData } from "../schema/signup.schema";

// Hook for organization registration using TanStack Query
export const useOrganizationSignup = () => {
  return useMutation<OrganizationLoginResponse, Error, OrganizationSignupFormData>({
    mutationFn: (organizationData) => registerOrganization(organizationData),
    onSuccess: () => {
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      console.error("Organization registration error:", error);
      // TODO: Add toast notification for error
    },
  });
};

// Hook for member registration using TanStack Query
export const useMemberSignup = () => {
  return useMutation<MemberLoginResponse, Error, MemberSignupFormData>({
    mutationFn: (memberData) => registerMember(memberData),
    onSuccess: () => {
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      console.error("Member registration error:", error);
      // TODO: Add toast notification for error
    },
  });
};