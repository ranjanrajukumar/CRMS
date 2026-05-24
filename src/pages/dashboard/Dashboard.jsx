import { useMemo } from "react";
import { useSelector } from "react-redux";

import AppLayout from "../../layouts/AppLayout";
import ActiveAgentsTable from "../../components/dashboard/ActiveAgentsTable";
import PortfolioSummaryCards from "../../components/dashboard/PortfolioSummaryCards";
import TodayFollowUpTable from "../../components/dashboard/TodayFollowUpTable";
import { useGetDashboardCardsQuery } from "../../store/api/endpoints/dashboardApi";

function Dashboard() {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const requestParams = useMemo(
    () => ({
      userType: (userDetails?.userRole || "admin").toLowerCase(),
      userName: userDetails?.userName || "demo",
    }),
    [userDetails?.userName, userDetails?.userRole]
  );
  const {
    data: cards = [],
    isLoading,
    isFetching,
    error,
  } = useGetDashboardCardsQuery(requestParams);
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.data?.message || error?.error || "";
  const loading = isLoading || isFetching;

  return (
    <AppLayout>
      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <PortfolioSummaryCards
        cards={cards}
        loading={loading}
        error={errorMessage}
      />

      <div className="mt-6 grid grid-cols-1 gap-6">
        <ActiveAgentsTable />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <TodayFollowUpTable />
      </div>
    </AppLayout>
  );
}

export default Dashboard;
