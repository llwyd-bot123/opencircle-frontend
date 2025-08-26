import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEventsByRsvpStatus } from "../lib/event.api";
import type {
  EventsByRsvpStatusQueryParams,
  EventsByRsvpStatusResponse,
} from "../schema/event.types";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Custom hook for fetching user events by RSVP status with infinite scrolling
export const useUserEventsByRsvpStatusInfiniteQuery = (
  params: EventsByRsvpStatusQueryParams
) => {
  const { accountUuid, rsvpStatus, limit = 10 } = params;

  return useInfiniteQuery<EventsByRsvpStatusResponse>({
    queryKey: [
      QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS,
      accountUuid,
      rsvpStatus,
    ],
    queryFn: async ({ pageParam }) => {
      // Ensure pageParam is a number with default value of 1
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await getUserEventsByRsvpStatus(
        accountUuid,
        rsvpStatus,
        page,
        limit
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.pages
        ? pagination.page + 1
        : undefined;
    },
    enabled: !!accountUuid && !!rsvpStatus,
  });
};
