import axiosInstance from "@src/shared/api/axios";
import type { EventsByRsvpStatusResponse } from "../schema/event.types";

// Fetches user events based on RSVP status with pagination
export const getUserEventsByRsvpStatus = async (
  accountUuid: string,
  rsvpStatus: string,
  page: number = 1,
  limit: number = 10
): Promise<EventsByRsvpStatusResponse> => {
  try {
    const response = await axiosInstance.get<EventsByRsvpStatusResponse>(
      `/event/user/events_by_rsvp_status_with_comments`,
      {
        params: {
          account_uuid: accountUuid,
          page,
          limit,
          rsvp_status: rsvpStatus,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user events by RSVP status:", error);
    throw error;
  }
};
