import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  updateEvent,
  acceptRsvpRequest,
  declineRsvpRequest,
} from "../lib/event.api";
import type {
  CreateEventFormData,
  EventFormData,
} from "../schema/event.schema";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type {
  CreateEventResponse,
  UpdateEventResponse,
} from "../schema/event.type";

// Custom hook for handling event creation functionality using TanStack Query
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateEventResponse, Error, CreateEventFormData>({
    mutationFn: (eventData) => createEvent(eventData),
    onSuccess: () => {
      // Invalidate the events query to refresh the events list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
    },
    onError: (error) => {
      console.error("Event creation error:", error);
      // Error handling can be implemented here
    },
  });
};

// Custom hook for handling event deletion functionality using TanStack Query
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (eventId) => deleteEvent(eventId),
    onSuccess: () => {
      // Invalidate the events query to refresh the events list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });
    },
    onError: (error) => {
      console.error("Event deletion error:", error);
      // Error handling can be implemented here
    },
  });
};

// Custom hook for handling event update functionality using TanStack Query
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateEventResponse,
    Error,
    { eventId: number; eventData: EventFormData }
  >({
    mutationFn: ({ eventId, eventData }) => updateEvent(eventId, eventData),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh event list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      // Invalidate the specific event query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS, variables.eventId],
      });
    },
    onError: (error) => {
      console.error("Event update error:", error);
    },
  });
};

export const useAcceptRsvpRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message?: string }, Error, number>({
    mutationFn: (rsvpId) => acceptRsvpRequest(rsvpId),
    onSuccess: () => {
      // Invalidate queries to refresh event list and pending requests
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      // Invalidate all event RSVPs queries to refresh the RSVPs data
      // This will refresh any event RSVPs data that might be affected by this mutation
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS_RSVPS],
      });
    },
    onError: (error) => {
      console.error("RSVP acceptance error:", error);
    },
  });
};

export const useDeclineRsvpRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message?: string }, Error, number>({
    mutationFn: (rsvpId) => declineRsvpRequest(rsvpId),
    onSuccess: () => {
      // Invalidate queries to refresh event list and pending requests
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      // Invalidate all event RSVPs queries to refresh the RSVPs data
      // This will refresh any event RSVPs data that might be affected by this mutation
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS_RSVPS],
      });
    },
    onError: (error) => {
      console.error("RSVP decline error:", error);
    },
  });
};
