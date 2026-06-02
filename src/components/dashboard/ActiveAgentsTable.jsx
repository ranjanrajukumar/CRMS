
import { useMemo, useState } from "react";
import {
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const roleStyles = {
  Admin: "bg-violet-100 text-violet-700",
  TL: "bg-amber-100 text-amber-700",
  Agent: "bg-cyan-100 text-cyan-700",
};

const statusStyles = {
  Active: "bg-emerald-500",
  Inactive: "bg-slate-400",
  Busy: "bg-orange-500",
};

function ActiveAgentsTable({ agents = [], loading = false, error = "" }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const translateText = (text) => t(`appText.${text}`, { defaultValue: text });
  const visibleAgents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return agents;
    }

    return agents.filter((agent) =>
      [
        agent.name,
        agent.email,
        agent.role,
        agent.portfolio,
        agent.teamLead,
        agent.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedSearch)
        )
    );
  }, [agents, searchTerm]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {translateText("Team Members")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {translateText("Track active agents and performance status")}
          </p>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={translateText("Search...")}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white md:w-72"
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <div className="max-h-[928px] overflow-auto">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                {[
                  "SNo",
                  "Agent",
                  "Email Address",
                  "Role",
                  "Portfolio",
                  "Team Lead",
                  "Status",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {translateText(item)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 7 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-5">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && visibleAgents.map((agent, index) => (
                <tr
                  key={agent.id || index}
                  className="transition-all hover:bg-slate-50"
                >
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                    {index + 1}
                  </td>

                  {/* User */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="theme-avatar-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md">
                        {agent.initials || agent.name.charAt(0)}
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {agent.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          {translateText("Agent ID")}: AG-100{index + 1}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {agent.email || "-"}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        roleStyles[agent.role] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {translateText(agent.role)}
                    </span>
                  </td>

                  {/* Portfolio */}
                  <td className="px-6 py-5 text-sm font-medium text-slate-700">
                    {agent.portfolio}
                  </td>

                  {/* TL */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {agent.teamLead}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          statusStyles[agent.status] || "bg-slate-400"
                        }`}
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {translateText(agent.status)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && visibleAgents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-5 text-sm text-slate-500">
                    {translateText("No team members found.")}
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

export default ActiveAgentsTable;
