import API from "../../services/api";
import { getAuthToken } from "../auth/authUtils";

export const getProcessDashboard = async ({ userType, userName }) => {
  const payload = { userType, userName };
  const token = getAuthToken();

  const response = await API.get("/ManageBankDashboard/process/dashboard", {
    params: payload,
    data: payload,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};
