import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const envBaseUrl = import.meta.env.VITE_API_URL;
const fallbackBaseUrl =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:4000"
    : window.location.origin;

const baseUrl = envBaseUrl ?? fallbackBaseUrl;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});
