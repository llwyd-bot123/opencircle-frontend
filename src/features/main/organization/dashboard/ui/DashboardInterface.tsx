import MemberStatistic from "@src/features/main/organization/dashboard/components/MemberStatistic";
import EventsStatistic from "@src/features/main/organization/dashboard/components/EventsStatistic";
import MemberInteractionStatistic from "@src/features/main/organization/dashboard/components/MemberInteractionStatistic";
import EventInteractionStatistic from "@src/features/main/organization/dashboard/components/EventInteractionStatistic";
import PostInteractionStatistic from "@src/features/main/organization/dashboard/components/PostInteractionStatistic";
import { useMembershipAnalytics, useEventsSummary } from "@src/features/main/organization/dashboard/model/dashboard.query";
import { useState } from "react";

export default function DashboardInterface() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { data: membership } = useMembershipAnalytics();
  const { data: eventsSummary } = useEventsSummary({ start_date: startDate, end_date: endDate });

  const counts = membership?.membership_analytics?.status_counts;
  return (
    <div className="w-full md:w-11/12 lg:w-4/5 px-4 sm:px-6 lg:px-30 py-10 mx-auto">
      <MemberStatistic counts={counts} />
      <EventsStatistic
        data={eventsSummary}
        startDate={startDate}
        endDate={endDate}
        onChangeStart={setStartDate}
        onChangeEnd={setEndDate}
      />
      <MemberInteractionStatistic />
      <EventInteractionStatistic />
      <PostInteractionStatistic />
    </div>
  );
}
