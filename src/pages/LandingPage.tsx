import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../features/auth/components/AuthCard";
import { useAuth } from "../features/auth/useAuth";
import squadbuilderLogo from "../../public/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!loading) setIsReadyToShow(true);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-indigo-100">
        <p className="text-sm text-gray-700">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl flex flex-col items-center -mt-10">
        <div
          className={`flex flex-col items-center mb-20 transition-all duration-[1400ms] ease-out ${
            isReadyToShow
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-6 scale-90"
          }`}
        >
          <div className="relative flex h-64 w-64 md:h-72 md:w-72 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-3xl animate-pulse-slow" />

            <div
              className="relative flex h-64 w-64 md:h-72 md:w-72 items-center justify-center
                         rounded-full bg-white shadow-2xl shadow-emerald-100/70 overflow-hidden
                         transition-all duration-500 hover:scale-105 hover:shadow-emerald-200"
            >
              <img
                src={squadbuilderLogo}
                alt="SquadBuilder logo"
                className="h-full w-full object-contain mix-blend-multiply pointer-events-none"
              />
            </div>
          </div>
        </div>
        <div
          className={`w-full flex flex-col md:flex-row items-center justify-center md:items-start 
                      gap-10 transition-all duration-[1400ms] ease-out ${
                        isReadyToShow
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
          style={{ transitionDelay: isReadyToShow ? "350ms" : "0ms" }}
        >
          <div className="w-full max-w-md transition-all duration-[1300ms] ease-out">
            <AuthCard />
          </div>

          <div className="w-full max-w-md space-y-6 text-center md:text-center mt-6">
            <p
              className={`text-base md:text-lg text-slate-700 transition-all duration-[1300ms] ease-out ${
                isReadyToShow
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isReadyToShow ? "450ms" : "0ms" }}
            >
              Organize your football squad, manage fixtures, and track player
              availability — all in one place.
            </p>
            <ul className="space-y-3 text-sm md:text-base text-slate-700 mx-auto w-fit text-left">
              {[
                "Plan lineups and starting elevens with ease.",
                "Track player availability instantly before every match.",
                "Give your team clarity and reduce last-minute chaos.",
              ].map((text, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 transition-all duration-[1300ms] ease-out ${
                    isReadyToShow
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  } group`}
                  style={{
                    transitionDelay: isReadyToShow
                      ? `${550 + i * 150}ms`
                      : "0ms",
                  }}
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600 group-hover:scale-110" />
                  <span className="transition-all duration-300 group-hover:text-emerald-700 group-hover:translate-x-1">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
