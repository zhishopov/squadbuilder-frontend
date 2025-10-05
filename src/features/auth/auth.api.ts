import { api } from "../../utils/api";
import type { CurrentUser, Role } from "../../types/auth";

type LoginBody = { email: string; password: string };
type SignupBody = { email: string; password: string; role: Role };

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<CurrentUser, void>({
      query: () => ({ url: "/auth/current-user", method: "GET" }),
    }),

    login: build.mutation<{ ok: true }, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    signup: build.mutation<{ ok: true }, SignupBody>({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),

    logout: build.mutation<{ ok: true }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const { useMeQuery } = authApi;
