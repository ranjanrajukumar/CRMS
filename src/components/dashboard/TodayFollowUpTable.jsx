import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";

const formatFollowupDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const filterOptions = [
  { label: "Today", value: "todayFollowups" },
  { label: "Tomorrow", value: "tomorrowFollowups" },
];

function TodayFollowUpTable({
  followups = { todayFollowups: [], tomorrowFollowups: [] },
  loading = false,
  error = "",
}) {
  const [followupFilter, setFollowupFilter] = useState("todayFollowups");
  const rows = useMemo(
    () => followups?.[followupFilter] || [],
    [followupFilter, followups]
  );

  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Follow-up Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track scheduled customer follow-ups
          </p>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="radiogroup"
          aria-label="Follow-up filter"
        >
          {filterOptions.map((option) => {
            const isSelected = followupFilter === option.value;

            return (
              <label
                key={option.value}
                className={`flex h-12 cursor-pointer items-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                <input
                  type="radio"
                  name="followupFilter"
                  value={option.value}
                  checked={isSelected}
                  onChange={(event) => setFollowupFilter(event.target.value)}
                  className="h-4 w-4 accent-emerald-600"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <div className="max-h-[min(720px,calc(100dvh-280px))] overflow-auto">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                {["SNo", "Follow-up", "Bank Name", "Account No", "Follow-up Date"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-5">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading &&
                rows.map((row, index) => (
                  <tr key={row.id} className="transition-all hover:bg-slate-50">
                    <td className="px-4 py-5 text-sm font-semibold text-slate-700 sm:px-6">
                      {index + 1}
                    </td>
                    <td className="px-4 py-5 sm:px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                          <CalendarClock size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {row.followupType}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Follow-up task
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-700 sm:px-6">
                      {row.bankName}
                    </td>
                    <td className="px-4 py-5 text-sm text-slate-600 sm:px-6">
                      {row.accountNumber}
                    </td>
                    <td className="px-4 py-5 text-sm text-slate-600 sm:px-6">
                      {formatFollowupDate(row.followupDate)}
                    </td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-sm text-slate-500">
                    No follow-up records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}

export default TodayFollowUpTable;
