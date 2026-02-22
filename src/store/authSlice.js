import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authAxios } from "../utils/axiosConfig";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Check session validity on app load
export const validateSession = createAsyncThunk(
  "auth/validateSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`${API_BASE_URL}/api/auth/validate`, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      // Completely suppress all logging for validation failures
      return rejectWithValue("No active session");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to logout"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false, // Change to false to skip initial validation
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(validateSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      });
  },
});

export const { clearUser, setUser } = authSlice.actions;
export default authSlice.reducer;
