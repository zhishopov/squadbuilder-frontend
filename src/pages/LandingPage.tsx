import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../features/auth/components/AuthCard";
import { useAuth } from "../features/auth/useAuth";
import squadbuilderLogo from "../../public/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-indigo-100">
        <p className="text-sm text-gray-700">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl flex flex-col items-center mb-64">
        <div className="flex flex-col items-center -mt-6 mb-24">
          <div className="flex h-64 w-64 md:h-72 md:w-72 items-center justify-center rounded-full bg-white shadow-lg shadow-emerald-100/60 overflow-hidden">
            <img
              src={squadbuilderLogo}
              alt="SquadBuilder logo"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-center md:items-start gap-10">
          <div className="w-full max-w-md">
            <AuthCard />
          </div>

          <div className="w-full max-w-md space-y-6 text-center md:text-center mt-6">
            <p className="text-base md:text-lg text-slate-700">
              Organize your football squad, manage fixtures, and track player
              availability — all in one place.
            </p>
            <ul className="space-y-3 text-sm md:text-base text-slate-700 mx-auto w-fit text-left">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Plan lineups and starting elevens with ease.</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Track player availability instantly before every match.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Give your team clarity and reduce last-minute chaos.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
