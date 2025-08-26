import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembers, getMemberRequests } from "../lib/member.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Hook for fetching organization members
export const useOrganizationMembers = (organizationId: number) => {
  console.log("hererere");
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERS, organizationId],
    queryFn: () => getOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });
};

// Hook for fetching member requests
export const useMemberRequests = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS],
    queryFn: getMemberRequests,
  });
};
