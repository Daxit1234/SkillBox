// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  otpTimer: 0
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
    },
    setOtpTimer: (state, action) => {
      state.otpTimer = action.payload
    }
  },
});

export const { loginSuccess, logoutSuccess, setOtpTimer } = authSlice.actions;
export default authSlice.reducer;
