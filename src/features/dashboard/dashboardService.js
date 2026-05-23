import API from "../../services/api";

export const getProcessDashboard = async ({ userType, userName }) => {
  const payload = { userType, userName };

  const response = await API.get("/ManageBankDashboard/process/dashboard", {
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
