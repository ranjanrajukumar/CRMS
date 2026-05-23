import API from "../../services/api";
import { getAuthToken } from "../auth/authUtils";

export const getProcessDashboard = async ({ userType, userName }) => {
  const token = getAuthToken();

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
