import { useQuery } from "@tanstack/react-query";
import { getOrganizationMemberships, getPendingOrganizationMemberships } from "../lib/organization.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Hook for fetching organization memberships for the current user
export const useOrganizationMembershipsQuery = (accountUuid?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERSHIP, accountUuid],
    queryFn: () => getOrganizationMemberships(accountUuid || ""),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching pending organization memberships for the current user
export const usePendingOrganizationMembershipsQuery = (accountUuid?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS, accountUuid],
    queryFn: () => getPendingOrganizationMemberships(accountUuid || ""),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};