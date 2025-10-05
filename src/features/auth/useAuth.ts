import { useMeQuery } from "./auth.api";

export function useAuth() {
  const { data, isLoading, isFetching, isError } = useMeQuery();

  const user = data ?? null;
  const loading = isLoading || isFetching;
  const isAuthenticated = !!user && !isError;
  const role = user?.role ?? null;

  return { user, role, loading, isAuthenticated };
}
