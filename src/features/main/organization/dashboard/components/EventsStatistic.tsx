import ReactApexChart from "react-apexcharts";
import type { EventsSummaryResponse } from "@src/features/main/organization/dashboard/schema/dashboard.types";
import { DEFAULT_GRAPH_COLORS } from "@src/shared/enums/graphColors";
import { RSVP_LABELS, buildRsvpSeries } from "@src/shared/enums/rsvp";
import ActiveAndPastEventsStatistic from "./ActiveAndPastEventsStatistic";

type EventsStatisticProps = {
  data?: EventsSummaryResponse | null;
  startDate?: string | null;
  endDate?: string | null;
  onChangeStart?: (value: string | null) => void;
  onChangeEnd?: (value: string | null) => void;
};

export default function EventsStatistic({ data, startDate, endDate, onChangeStart, onChangeEnd }: EventsStatisticProps) {
  const joined = data?.summary.rsvp_counts.joined ?? 67;
  const pending = data?.summary.rsvp_counts.pending ?? 87;
  const rejected = data?.summary.rsvp_counts.rejected ?? 20;
  const total = data?.summary.rsvp_counts.total ?? joined + pending + rejected;

  const series = buildRsvpSeries({ joined, pending, rejected });
  const options: ApexCharts.ApexOptions = {
    chart: { type: "donut" },
    labels: RSVP_LABELS,
    colors: DEFAULT_GRAPH_COLORS,
    legend: {
      position: "right",
      labels: { colors: "#29465b" },
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
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

  const downloadCsv = () => {
    const rows = [
      ["Category", "Value"],
      ["Joined", String(joined)],
      ["Pending", String(pending)],
      ["Reject", String(rejected)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events-summary.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mb-12">
      <h2 className="text-responsive-base font-bold text-primary mb-3">Events</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <div className="text-responsive-xs text-primary font-semibold mb-2">Events Summary</div>
            <div className="space-y-3">
              <div>
                <div className="text-responsive-xxs text-primary">From</div>
                <div className="relative">
                  <input
                    type="date"
                    value={toInputValue(startDate)}
                    onChange={(e) => onChangeStart?.(toStartOfDay(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
                  />
                </div>
              </div>
              <div>
                <div className="text-responsive-xxs text-primary">To</div>
                <div className="relative">
                  <input
                    type="date"
                    value={toInputValue(endDate)}
                    onChange={(e) => onChangeEnd?.(toEndOfDay(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={downloadCsv}
                title="Download CSV"
                className="border border-gray-300 text-primary bg-white hover:bg-gray-50 rounded-lg px-3 py-1 text-responsive-xxs"
              >
                Download CSV
              </button>
            </div>
            <ReactApexChart options={options} series={series} type="donut" height={300} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <ActiveAndPastEventsStatistic />
      </div>
    </section>
  );
}
