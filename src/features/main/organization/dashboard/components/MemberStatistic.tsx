import type { StatusCounts } from "@src/features/main/organization/dashboard/schema/dashboard.types";

type MemberStatisticProps = {
  counts?: StatusCounts;
  approved?: number;
  pending?: number;
  rejected?: number;
  left?: number;
};

export default function MemberStatistic({ counts }: MemberStatisticProps) {
  const emptyCount = 0;
  const items = [
    { label: "Approved", value: counts?.approved ?? emptyCount },
    { label: "Pending", value: counts?.pending ?? emptyCount },
    { label: "Rejected", value: counts?.rejected ?? emptyCount },
    { label: "Left", value: counts?.left ?? emptyCount },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-responsive-base font-bold text-primary mb-3">Members</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-responsive-xs text-primary font-semibold">{item.label}</div>
            <div className="text-responsive-xl text-primary font-bold mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
