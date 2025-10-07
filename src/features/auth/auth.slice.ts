import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import type { CurrentUser } from "../../types/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: CurrentUser | null;
}

const initialState: AuthState = {
  status: "checking",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CurrentUser | null>) {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "unauthenticated";
    },
    clearUser(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.me.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.status = "authenticated";
      }
    );

    builder.addMatcher(authApi.endpoints.me.matchRejected, (state) => {
      state.user = null;
      state.status = "unauthenticated";
    });

    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.status = "unauthenticated";
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
