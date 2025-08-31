import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveOrganization } from "../lib/organization.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

// Hook for leaving an organization
export const useLeaveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: number) => leaveOrganization(organizationId),
    onSuccess: () => {
      // Invalidate and refetch organization memberships
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERSHIP],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_PAST_EVENTS],
      });
      showSuccessToast("Successfully left");
    },
    onError: (error) => {
      console.error("Failed to leave organization:", error);
      showErrorToast("Failed to leave");
    },
  });
};
