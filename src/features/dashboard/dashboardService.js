// import axios from "axios";
// import { getAuthToken } from "../auth/authUtils";

// export const getProcessDashboard = async ({ userType, userName }) => {
//   const payload = { userType, userName };
//   const token = getAuthToken();

//   const response = await axios.get("api/ManageBankDashboard/process/dashboard", {
//     params: payload,
//     data: payload,
//     headers: {
//       Accept: "*/*",
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });

//   return response.data;
// };

import API from "../../services/api";

export const getProcessDashboard = async ({ userType, userName }) => {
  const response = await API.get("/ManageBankDashboard/process/dashboard", {
    params: {
      userType,
      userName,
    },
  });

  return response.data;
};
