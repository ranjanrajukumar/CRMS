import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import AppLayout from "../../layouts/AppLayout";
import { useGetPortfolioCountDashboardQuery } from "../../store/api/endpoints/dashboardApi";

function DetailedDashboard() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const userDetails = useSelector((state) => state.auth.userDetails);
  const portfolioName = searchParams.get("portfolioName") || userDetails?.product || "";
  const requestParams = useMemo(
    () => ({
      userType: (userDetails?.userRole || "admin").toLowerCase(),
      userName: userDetails?.userName || "demo",
      portfolioName,
    }),
    [portfolioName, userDetails?.userName, userDetails?.userRole]
  );
  const {
    data: cards = [],
    isLoading,
    isFetching,
    error,
  } = useGetPortfolioCountDashboardQuery(requestParams, {
    skip: !portfolioName,
  });
  const loading = isLoading || isFetching;
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.data?.message || error?.error || "";
  const visibleCards = useMemo(() => {
    const filteredCards = cards.filter((card) =>
      String(card.label).toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    if (sortBy === "highest") {
      return [...filteredCards].sort(
        (first, second) => Number(second.value) - Number(first.value)
      );
    }

    if (sortBy === "lowest") {
      return [...filteredCards].sort(
        (first, second) => Number(first.value) - Number(second.value)
      );
    }

    if (sortBy === "name") {
      return [...filteredCards].sort((first, second) =>
        String(first.label).localeCompare(String(second.label))
      );
    }

    return filteredCards;
  }, [cards, searchTerm, sortBy]);

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
           Details Dashboard
          </p>
          {portfolioName && (
            <p className="mt-1 text-sm text-slate-500">
              Portfolio: <span className="font-semibold text-slate-700">{portfolioName}</span>
            </p>
          )}
        </div>

        <Link
          to="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {!portfolioName && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Select a portfolio from the dashboard to view detailed counts.
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="rounded-3xl bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Portfolio Count Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing detailed totals for the selected portfolio
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search counts"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white md:w-72"
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white"
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest Count</option>
              <option value="lowest">Lowest Count</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100">
          <div className="max-h-[calc(100dvh-300px)] overflow-y-auto overflow-x-hidden bg-white p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {loading &&
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[128px] animate-pulse rounded-2xl bg-slate-50 p-5"
                >
                  <div className="h-7 w-12 rounded bg-slate-100" />
                  <div className="mt-4 h-3 w-28 rounded bg-slate-100" />
                  <div className="mt-3 h-px w-full bg-slate-200" />
                </div>
              ))}

            {!loading &&
              visibleCards.map((card) => (
                <article
                  key={card.key}
                  className="rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-3xl font-bold leading-none text-slate-800">
                        {card.value}
                      </p>
                      <p className="mt-3 truncate text-sm font-semibold uppercase tracking-wide text-slate-500">
                        {card.label}
                      </p>
                    </div>

                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md"
                      aria-hidden="true"
                    >
                      <Eye size={22} strokeWidth={2} />
                    </span>
                  </div>

                  <div className="mt-4 h-px bg-slate-100" />
                </article>
              ))}

            {!loading && !errorMessage && visibleCards.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm font-medium text-slate-500 md:col-span-2 xl:col-span-4">
                No count details found.
              </div>
            )}
          </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

export default DetailedDashboard;
