import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import ChangePassword from "../pages/account/ChangePassword";
import Profile from "../pages/account/Profile";
import AllocationBackup from "../pages/allocation/backup/AllocationBackup";
import AllocationDelete from "../pages/allocation/delete/AllocationDelete";
import DumpSearch from "../pages/allocation/dump-search/DumpSearch";
import AllocationTransfer from "../pages/allocation/transfer/AllocationTransfer";
import AllocationUpdate from "../pages/allocation/update/AllocationUpdate";
import Login from "../pages/auth/Login";
import Customers from "../pages/customers/Customers";
import Dashboard from "../pages/dashboard/Dashboard";
import DetailedDashboard from "../pages/detailed-dashboard/DetailedDashboard";
import AdvanceSearch from "../pages/operation/advance-search/AdvanceSearch";
import FieldVisit from "../pages/operation/field-visit/FieldVisit";
import FollowupDetails from "../pages/operation/followup-details/FollowupDetails";
import RequestedSms from "../pages/operation/requested-sms/RequestedSms";
import AllPortfolio from "../pages/reports/all-portfolio/AllPortfolio";
import SettingsSmtpDetails from "../pages/settings/smtp-details/SmtpDetails";
import ManageUser from "../pages/setup/manage-user/ManageUser";
import Portfolio from "../pages/setup/portfolio/Portfolio";
import StatusCode from "../pages/setup/status-code/StatusCode";
import UploadAllocation from "../pages/upload-allocation/UploadAllocation";
import { hasValidSession } from "../utils/auth/authUtils";

function ProtectedRoute() {
  return hasValidSession() ? <Outlet /> : <Navigate to="/" replace />;
}

function PublicRoute() {
  return hasValidSession() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detailed-dashboard" element={<DetailedDashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/setup/portfolio" element={<Portfolio />} />
          <Route path="/setup/status-code" element={<StatusCode />} />
          <Route path="/setup/manage-user" element={<ManageUser />} />

          <Route path="/allocation/transfer" element={<AllocationTransfer />} />
          <Route path="/allocation/delete" element={<AllocationDelete />} />
          <Route path="/allocation/backup" element={<AllocationBackup />} />
          <Route path="/allocation/dump-search" element={<DumpSearch />} />
          <Route path="/allocation/update" element={<AllocationUpdate />} />

          <Route path="/operation/advance-search" element={<AdvanceSearch />} />
          <Route path="/operation/requested-sms" element={<RequestedSms />} />
          <Route path="/operation/field-visit" element={<FieldVisit />} />
          <Route
            path="/operation/followup-details"
            element={<FollowupDetails />}
          />

          <Route path="/upload-allocation" element={<UploadAllocation />} />
          <Route path="/reports/all-portfolio" element={<AllPortfolio />} />
          <Route
            path="/settings/smtp-details"
            element={<SettingsSmtpDetails />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
