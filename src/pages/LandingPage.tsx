import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../features/auth/components/AuthCard";
import { useAuth } from "../features/auth/useAuth";
import squadbuilderLogo from "/logo.png";

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
    if (!loading) {
      setIsReadyToShow(true);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-indigo-100">
        <p className="text-sm text-gray-700">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-100 via-white to-indigo-100">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-6xl flex-col items-center -mt-10">
          <div
            className={`mb-20 flex flex-col items-center transition-all duration-[1400ms] ease-out ${
              isReadyToShow
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-6 scale-90"
            }`}
          >
            <div className="relative flex h-64 w-64 items-center justify-center md:h-72 md:w-72">
              <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-3xl animate-pulse-slow" />

              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-white overflow-hidden shadow-2xl shadow-emerald-100/70 transition-all duration-500 hover:scale-105 hover:shadow-emerald-200 md:h-72 md:w-72">
                <img
                  src={squadbuilderLogo}
                  alt="SquadBuilder logo"
                  className="h-full w-full pointer-events-none object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          <div
            className={`flex w-full flex-col items-center justify-center gap-10 md:flex-row md:items-start transition-all duration-[1400ms] ease-out ${
              isReadyToShow
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isReadyToShow ? "350ms" : "0ms" }}
          >
            <div className="w-full max-w-md transition-all duration-[1300ms] ease-out">
              <AuthCard />
            </div>

            <div className="mt-6 w-full max-w-md space-y-6 text-center md:text-center">
              <p
                className={`text-base font-medium tracking-tight text-slate-700 md:text-lg transition-all duration-[1300ms] ease-out hover:-translate-y-0.5 hover:text-emerald-800 ${
                  isReadyToShow
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: isReadyToShow ? "450ms" : "0ms" }}
              >
                Organize your{" "}
                <span className="font-semibold text-emerald-700">
                  football squad
                </span>
                , manage{" "}
                <span className="font-semibold text-emerald-700">fixtures</span>
                , and track{" "}
                <span className="font-semibold text-emerald-700">
                  player availability
                </span>{" "}
                — all in one place.
              </p>

              <ul className="mx-auto w-full max-w-md space-y-4 text-left text-sm text-slate-700 md:text-base">
                {[
                  "Plan lineups and starting elevens with ease.",
                  "Track player availability instantly before every match.",
                  "Give your team clarity and reduce last-minute chaos.",
                ].map((text, index) => (
                  <li
                    key={text}
                    className={`group transition-all duration-[1300ms] ease-out ${
                      isReadyToShow
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                    style={{
                      transitionDelay: isReadyToShow
                        ? `${550 + index * 150}ms`
                        : "0ms",
                    }}
                  >
                    <div
                      className="
                        flex items-start gap-3
                        rounded-2xl border border-emerald-100
                        bg-white/70 px-4 py-3
                        shadow-lg shadow-emerald-100/50
                        backdrop-blur-sm
                        transition-all duration-300
                        group-hover:-translate-y-0.5
                        group-hover:border-emerald-200
                        group-hover:bg-white
                        group-hover:shadow-xl group-hover:shadow-emerald-200/70
                      "
                    >
                      <span
                        className="
                          mt-2 h-2 w-2 rounded-full bg-emerald-500
                          transition-all duration-300
                          group-hover:scale-125 group-hover:bg-emerald-600
                        "
                      />
                      <span
                        className="
                          text-sm font-medium text-slate-800 md:text-base
                          transition-all duration-300
                          group-hover:translate-x-1 group-hover:text-emerald-800
                        "
                      >
                        {text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-emerald-100/60 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-slate-600 md:flex-row md:text-sm">
          <p className="tracking-tight">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-emerald-700">SquadBuilder</span>
            . All rights reserved.
          </p>
          <p className="flex items-center gap-2 tracking-tight">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500" />
            <span className="bg-gradient-to-r from-emerald-700 to-indigo-700 bg-clip-text font-medium text-transparent">
              Built for grassroots coaches and players.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
