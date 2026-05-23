import API from "../../services/api";
import { getAuthToken } from "../auth/authUtils";

export const getProcessDashboard = async ({ userType, userName }) => {
  console.log("Fetching dashboard data with params:", { userType, userName });
  const token = getAuthToken();
console.log("Auth token for dashboard request:", token ? "Present" : "Not found");
  const response = await API.get("/ManageBankDashboard/process/dashboard", {
    baseURL: "/api",
    params: {
      userType,
      userName,
    },
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};
