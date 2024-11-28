import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../services/ApiEndpoint";

// Async thunk to fetch user data
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (_, { rejectWithValue }) => {
    try {
      const request = await get("/api/auth/CheckUser");
      return request.data;
    } catch (error) {
      // Return error message for better debugging
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false, // More explicit than null
  error: null,
  user: null,
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    Logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use rejected value
        state.user = null;
      });
  },
});

export const { SetUser, Logout } = AuthSlice.actions;
export default AuthSlice.reducer;
