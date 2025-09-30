import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_API_URL ?? "https://squadbuilder.online";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
