import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import type { CurrentUser, Role } from "../../types/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type NormalizedUser = {
  id: number;
  email: string;
  role: Role;
};

interface AuthState {
  status: AuthStatus;
  user: NormalizedUser | null;
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
      const payload = action.payload;
      if (payload && typeof payload.id === "string") {
        state.user = {
          id: Number(payload.id),
          email: payload.email,
          role: payload.role,
        };
        state.status = "authenticated";
      } else {
        state.user = null;
        state.status = "unauthenticated";
      }
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
        if (!payload || typeof payload.id !== "string") {
          state.user = null;
          state.status = "unauthenticated";
          return;
        }
        state.user = {
          id: Number(payload.id),
          email: payload.email,
          role: payload.role,
        };
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
