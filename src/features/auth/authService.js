import API from "../../services/api";

export const loginUser = async (loginData) => {
  const response = await API.post("/ManageAccount/login", {
    userName: loginData.userName,
    password: loginData.password,
  });

  return response.data;
};

export const forgotPassword = async (forgotData) => {
  const response = await API.post(
    "/ManageAccount/forgot-password",
    {
      userName: forgotData.userName,
    },
  );

  return response.data;
};
