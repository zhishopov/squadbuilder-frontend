import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./features/auth/auth.slice";
import { useMeQuery } from "./features/auth/auth.api";
import type { AppDispatch } from "./store";
import type { PropsWithChildren } from "react";

export default function AppBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();

  const { data, isSuccess, isError } = useMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return <>{children}</>;
}
