import { Eye } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import AppLayout from "../../layouts/AppLayout";
import { useGetPortfolioCountDashboardQuery } from "../../store/api/endpoints/dashboardApi";

function DetailedDashboard() {
  const [searchParams] = useSearchParams();
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

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[106px] animate-pulse rounded-sm border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-7 w-12 rounded bg-slate-100" />
              <div className="mt-4 h-3 w-28 rounded bg-slate-100" />
              <div className="mt-3 h-px w-full bg-slate-200" />
            </div>
          ))}

        {!loading &&
          cards.map((card) => (
            <article
              key={card.key}
              className="rounded-sm border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-3xl font-light leading-none text-blue-900">
                    {card.value}
                  </p>
                  <p className="mt-3 truncate text-sm font-medium uppercase text-slate-900">
                    {card.label}
                  </p>
                </div>

                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400"
                  aria-hidden="true"
                >
                  <Eye size={28} strokeWidth={1.8} />
                </span>
              </div>

              <div className="mt-3 h-px bg-slate-300" />
            </article>
          ))}
      </section>
    </AppLayout>
  );
}

export default DetailedDashboard;
