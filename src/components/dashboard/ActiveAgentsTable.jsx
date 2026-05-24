
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const activeAgents = [
  {
    name: "Admin",
    email: "demo@gmail.com",
    role: "Admin",
    portfolio: "Client One",
    tl: "Admin",
    status: "Online",
  },
  {
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    role: "TL",
    portfolio: "Collection Team",
    tl: "Demo",
    status: "Busy",
  },
  {
    name: "User One",
    email: "user@gmail.com",
    role: "Agent",
    portfolio: "Recovery Team",
    tl: "Rahul",
    status: "Offline",
  },
];

const roleStyles = {
  Admin: "bg-violet-100 text-violet-700",
  TL: "bg-amber-100 text-amber-700",
  Agent: "bg-cyan-100 text-cyan-700",
};

const statusStyles = {
  Online: "bg-emerald-500",
  Busy: "bg-orange-500",
  Offline: "bg-slate-400",
};

function ActiveAgentsTable() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Team Members
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track active agents and performance status
          </p>
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
              placeholder="Search..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white md:w-72"
            />
          </div>

          {/* Button */}
          <button className="h-12 rounded-2xl bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-700">
            + Add Agent
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Agent",
                  "Email Address",
                  "Role",
                  "Portfolio",
                  "Team Lead",
                  "Status",
                  "",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {activeAgents.map((agent, index) => (
                <tr
                  key={index}
                  className="transition-all hover:bg-slate-50"
                >
                  {/* User */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-md">
                        {agent.name.charAt(0)}
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {agent.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          Agent ID: AG-100{index + 1}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {agent.email}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[agent.role]}`}
                    >
                      {agent.role}
                    </span>
                  </td>

                  {/* Portfolio */}
                  <td className="px-6 py-5 text-sm font-medium text-slate-700">
                    {agent.portfolio}
                  </td>

                  {/* TL */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {agent.tl}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          statusStyles[agent.status]
                        }`}
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {agent.status}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5 text-right">
                    <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold">1-3</span> from{" "}
            <span className="font-semibold">3</span> agents
          </p>

          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100">
              <ChevronLeft size={18} />
            </button>

            <button className="flex h-10 min-w-[40px] items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">
              1
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ActiveAgentsTable;

