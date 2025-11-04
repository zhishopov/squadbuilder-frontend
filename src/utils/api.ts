import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { showErrorToast } from "./error";

const envBaseUrl = import.meta.env.VITE_API_URL;
const fallbackBaseUrl =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:4000"
    : window.location.origin;

const baseUrl = envBaseUrl ?? fallbackBaseUrl;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithErrorHandling: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    showErrorToast(result.error);
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});
