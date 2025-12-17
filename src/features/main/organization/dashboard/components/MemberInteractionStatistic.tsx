import { useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useCommentAnalyticsSummary } from "@src/features/main/organization/dashboard/model/dashboard.query";
import { DEFAULT_GRAPH_COLORS } from "@src/shared/enums/graphColors";

export default function MemberInteractionStatistic() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { data } = useCommentAnalyticsSummary({ start_date: startDate, end_date: endDate });

  const categories = useMemo(() => {
    const trends = data?.daily_trends ?? [];
    const sorted = [...trends].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map((d) => d.date.slice(5, 10));
  }, [data?.daily_trends]);

  const series = useMemo(() => {
    const trends = data?.daily_trends ?? [];
    const sorted = [...trends].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const events = sorted.map((d) => d.event_comments);
    const posts = sorted.map((d) => d.post_comments);
    const total = sorted.map((d) => d.total_comments);
    return [
      { name: "Event Comments", data: events },
      { name: "Post Comments", data: posts },
      { name: "Overall Comments", data: total },
    ];
  }, [data?.daily_trends]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: true,
        tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false },
      },
    },
    colors: [DEFAULT_GRAPH_COLORS[2], DEFAULT_GRAPH_COLORS[1], DEFAULT_GRAPH_COLORS[0]],
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    fill: { type: "gradient", gradient: { shadeIntensity: 0.2, opacityFrom: 0.4, opacityTo: 0.1 } },
    markers: { size: 3 },
    xaxis: { categories },
    yaxis: { title: { text: "Comments" } },
    legend: { position: "bottom" },
    grid: { strokeDashArray: 4 },
  };

  const toInputValue = (value?: string | null) => {
    if (!value) return "";
    return value.slice(0, 10);
  };

  const toStartOfDay = (dateStr: string): string | null => {
    if (!dateStr) return null;
    return `${dateStr} 00:00:00`;
  };

  const toEndOfDay = (dateStr: string): string | null => {
    if (!dateStr) return null;
    return `${dateStr} 23:59:59`;
  };

  return (
    <section className="mb-6">
      <h2 className="text-responsive-base font-bold text-primary mb-3">Interaction Summary</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-end space-x-3 mb-3">
          <div className="relative">
            <div className="text-responsive-xxs text-primary mb-1">Start Date</div>
            <input
              type="date"
              value={toInputValue(startDate)}
              onChange={(e) => setStartDate(toStartOfDay(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
            />
          </div>
          <div className="relative">
            <div className="text-responsive-xxs text-primary mb-1">End Date</div>
            <input
              type="date"
              value={toInputValue(endDate)}
              onChange={(e) => setEndDate(toEndOfDay(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
            />
          </div>
        </div>
        <ReactApexChart options={options} series={series} type="line" height={280} />
      </div>
    </section>
  );
}
