import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppLayout from "../../layouts/AppLayout";
import ActiveAgentsTable from "../../components/dashboard/ActiveAgentsTable";
import PortfolioSummaryCards from "../../components/dashboard/PortfolioSummaryCards";
import TodayFollowUpTable from "../../components/dashboard/TodayFollowUpTable";
import {
  useGetDashboardCardsQuery,
  useGetDashboardUsersQuery,
  useGetTodayFollowupsQuery,
} from "../../store/api/endpoints/dashboardApi";
import { setCredentials } from "../../store/slices/authSlice";
import { setAuthSession } from "../../utils/auth/authUtils";

function Dashboard() {
  const dispatch = useDispatch();
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
  const {
    data: followups = { todayFollowups: [], tomorrowFollowups: [] },
    isLoading: isFollowupsLoading,
    isFetching: isFollowupsFetching,
    error: followupsError,
  } = useGetTodayFollowupsQuery(requestParams);
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    error: usersError,
  } = useGetDashboardUsersQuery(requestParams);
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.data?.message || error?.error || "";
  const followupsErrorMessage =
    typeof followupsError === "string"
      ? followupsError
      : followupsError?.data?.message || followupsError?.error || "";
  const usersErrorMessage =
    typeof usersError === "string"
      ? usersError
      : usersError?.data?.message || usersError?.error || "";
  const loading = isLoading || isFetching;
  const followupsLoading = isFollowupsLoading || isFollowupsFetching;
  const usersLoading = isUsersLoading || isUsersFetching;

  const handlePortfolioSelect = (card) => {
    const updatedUserDetails = {
      ...(userDetails || {}),
      product: card.label,
      portfolioId: card.id,
    };

    setAuthSession({ userDetails: updatedUserDetails });
    dispatch(setCredentials({ userDetails: updatedUserDetails }));
  };

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
        selectedPortfolio={userDetails?.product}
        onSelectPortfolio={handlePortfolioSelect}
      />

      <div className="mt-6 grid grid-cols-1 gap-6">
        <ActiveAgentsTable
          agents={users}
          loading={usersLoading}
          error={usersErrorMessage}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <TodayFollowUpTable
          followups={followups}
          loading={followupsLoading}
          error={followupsErrorMessage}
        />
      </div>
    </AppLayout>
  );
}

export default Dashboard;
