import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../store";
import type { ReactNode } from "react";

type CoachRouteProps = {
  children: ReactNode;
};

export default function CoachRoute({ children }: CoachRouteProps) {
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const isLoggedIn = Boolean(currentUser?.id);
  const isCoach = currentUser?.role === "COACH";

  if (!isLoggedIn || !isCoach) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
