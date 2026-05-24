import { createSlice } from "@reduxjs/toolkit";

import { getUserDetails } from "../../utils/auth/authUtils";

const initialState = {
  userDetails: getUserDetails(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userDetails = action.payload?.userDetails || null;
    },
    clearCredentials: (state) => {
      state.userDetails = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
