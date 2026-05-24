function TodayFollowUpTable() {
  return (
    <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Today Follow-up
      </h2>

      <div className="mb-2 flex items-center gap-2 text-xs text-slate-700">
        Show
        <select className="rounded-sm border border-slate-300 bg-white px-2 py-1 outline-none">
          <option>10</option>
        </select>
        entries
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <thead className="bg-teal-700 text-xs uppercase text-white">
            <tr>
              {["Bank Name", "Account No"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  <span className="flex items-center justify-between gap-3">
                    {heading}
                    <span className="text-white/70">▲</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2} className="h-10 px-4 py-3 text-sm text-slate-500">
                No follow-up records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-900 pt-2 text-xs text-slate-700">
        Showing 0 to 0 of 0 entries
      </div>
    </section>
  );
}

export default TodayFollowUpTable;
