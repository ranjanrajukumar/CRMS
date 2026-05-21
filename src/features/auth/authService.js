import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (loginData) => {
  const response = await axios.get(`${BASE_URL}/ManageAccount/login`, {
    params: {
      userName: loginData.userName,
      password: loginData.password,
    },
  });

  return response.data;
};

export const forgotPassword = async (forgotData) => {
  const response = await axios.post(
    `${BASE_URL}/ManageAccount/forgot-password`,
    {
      userName: forgotData.userName,
    },
  );

  return response.data;
};
