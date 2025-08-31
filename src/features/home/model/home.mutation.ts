import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRsvp, joinOrganization, rsvpEvent } from "../lib/home.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import {
  showSuccessToast,
  showErrorToast,
} from "@src/shared/components/Toast/CustomToast";

// Hook for joining an organization
export const useJoinOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: number) => joinOrganization(organizationId),
    onSuccess: () => {
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
      showSuccessToast("Successfully requested to join");
    },
    onError: (error: unknown) => {
      console.error("Failed to join organization:", error);
      showErrorToast("Failed to join the organization");
    },
  });
};

// Hook for RSVPing to an event
export const useRsvpEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => rsvpEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      showSuccessToast("Successfully reserved");
    },
    onError: (error: unknown) => {
      console.error("Failed to RSVP to event:", error);
      showErrorToast("Failed to reserve");
    },
  });
};

// Hook for deleting an RSVP to an event
export const useDeleteRsvp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rsvpId: number) => deleteRsvp(rsvpId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      showSuccessToast("Reservation cancelled");
    },
    onError: (error: unknown) => {
      console.error("Failed to delete RSVP:", error);
      showErrorToast("Failed to cancel");
    },
  });
};
