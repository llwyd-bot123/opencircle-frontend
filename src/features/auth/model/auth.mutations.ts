import { useMutation } from "@tanstack/react-query";
import { loginMember, loginOrganization, logout, type LoginCredentials, type LoginResponse, type MemberLoginResponse, type OrganizationLoginResponse } from "../lib";

// Hook for member login using TanStack Query
export const useMemberLogin = () => {
  return useMutation<MemberLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginMember(credentials),
    onSuccess: () => {
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      console.error("Member login error:", error);
      // TODO: Add toast notification for error
    },
  });
};

// Hook for organization login using TanStack Query
export const useOrganizationLogin = () => {
  return useMutation<OrganizationLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginOrganization(credentials),
    onSuccess: () => {
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      console.error("Organization login error:", error);
      // TODO: Add toast notification for error
    },
  });
};

// @deprecated Use useMemberLogin or useOrganizationLogin instead

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials & { isOrganization: boolean }>({
    mutationFn: (credentials) => {
      const { isOrganization, ...loginCredentials } = credentials;
      return isOrganization 
        ? loginOrganization(loginCredentials)
        : loginMember(loginCredentials);
    },
    onSuccess: () => {
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      console.error("Login error:", error);
      // TODO: Add toast notification for error
    },
  });
};

// Hook for logout using TanStack Query
export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => logout(),
    onSuccess: () => {
      // TODO: Add toast notification for successful logout
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // TODO: Add toast notification for logout error
    },
  });
};
