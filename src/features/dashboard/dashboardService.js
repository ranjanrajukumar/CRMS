import API from "../../services/api";

export const getProcessDashboard = async ({ userType, userName }) => {
  const payload = { userType, userName };
  const response = await API.get("/ManageBankDashboard/process/dashboard", {
    params: payload,
    data: payload,
  });

  return response.data;
};
