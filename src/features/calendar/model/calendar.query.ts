import { useQuery } from "@tanstack/react-query";
import { fetchMemberCalendarEvents, fetchOrganizationCalendarEvents } from "../lib/calendar.api";
import { useAuthStore } from "../../../shared/store/auth";

// Custom hook to fetch calendar events for the current authenticated member by month and year
export const useMemberCalendarEvents = (month: number, year: number) => {
  const { user } = useAuthStore();
  const accountUuid = user?.uuid || "";

  return useQuery({
    queryKey: ["memberCalendarEvents", accountUuid, month, year],
    queryFn: () => fetchMemberCalendarEvents(accountUuid, month, year),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook to fetch calendar events for the current authenticated organization by month and year
export const useOrganizationCalendarEvents = (month: number, year: number) => {
  const { user } = useAuthStore();
  const accountUuid = user?.uuid || "";

  return useQuery({
    queryKey: ["organizationCalendarEvents", accountUuid, month, year],
    queryFn: () => fetchOrganizationCalendarEvents(accountUuid, month, year),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
