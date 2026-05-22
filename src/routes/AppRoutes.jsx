import { BrowserRouter, Route, Routes } from "react-router-dom";

import AllocationBackup from "../features/allocation/backup/AllocationBackup";
import AllocationDelete from "../features/allocation/delete/AllocationDelete";
import DumpSearch from "../features/allocation/dump-search/DumpSearch";
import AllocationTransfer from "../features/allocation/transfer/AllocationTransfer";
import AllocationUpdate from "../features/allocation/update/AllocationUpdate";
import Login from "../features/auth/Login";
import Customers from "../features/customers/Customers";
import Dashboard from "../features/dashboard/Dashboard";
import DetailedDashboard from "../features/detailed-dashboard/DetailedDashboard";
import AdvanceSearch from "../features/operation/advance-search/AdvanceSearch";
import FieldVisit from "../features/operation/field-visit/FieldVisit";
import FollowupDetails from "../features/operation/followup-details/FollowupDetails";
import RequestedSms from "../features/operation/requested-sms/RequestedSms";
import AllPortfolio from "../features/reports/all-portfolio/AllPortfolio";
import SettingsSmtpDetails from "../features/settings/smtp-details/SmtpDetails";
import ManageUser from "../features/setup/manage-user/ManageUser";
import Portfolio from "../features/setup/portfolio/Portfolio";
import StatusCode from "../features/setup/status-code/StatusCode";
import UploadAllocation from "../features/upload-allocation/UploadAllocation";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detailed-dashboard" element={<DetailedDashboard />} />
        <Route path="/customers" element={<Customers />} />

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
        <Route path="/settings/smtp-details" element={<SettingsSmtpDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
