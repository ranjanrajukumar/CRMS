import { useEffect, useMemo, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import { getUserDetails } from "../auth/authUtils";
import ActiveAgentsTable from "./ActiveAgentsTable";
import { getProcessDashboard } from "./dashboardService";
import { normalizeDashboardCards } from "./dashboardUtils";
import PortfolioSummaryCards from "./PortfolioSummaryCards";
import TodayFollowUpTable from "./TodayFollowUpTable";

function Dashboard() {
  const userDetails = getUserDetails();
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestParams = useMemo(
    () => ({
      userType: (userDetails?.userRole || "admin").toLowerCase(),
      userName: userDetails?.userName || "demo",
    }),
    [userDetails?.userName, userDetails?.userRole]
  );

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProcessDashboard(requestParams);
        const cards = normalizeDashboardCards(response);

        if (isMounted) {
          setDashboardData(cards);
        }
      } catch (err) {
        if (isMounted) {
          setDashboardData([]);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load dashboard data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [requestParams]);

  return (
    <AppLayout>
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <PortfolioSummaryCards
        cards={dashboardData}
        loading={loading}
        error={error}
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
