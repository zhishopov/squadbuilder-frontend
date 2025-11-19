import Header from "../components/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useMySquadQuery } from "../features/dashboard/dashboard.api";
import SquadCard from "../features/dashboard/components/SquadCard";
import NextFixtureCard from "../features/dashboard/components/NextFixtureCard";
import CreateSquadCard from "../features/squads/components/CreateSquadCard";
import { getErrorMessage } from "../utils/error";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserRole = currentUser?.role ?? null;

  const {
    data: currentSquad,
    isLoading: isSquadLoading,
    isError: isSquadError,
    error: squadError,
    refetch,
  } = useMySquadQuery();

  if (isSquadLoading) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-emerald-50 via-white to-indigo-50">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-4 text-2xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600">Loading…</p>
          </div>
        </main>
      </>
    );
  }

  if (isSquadError) {
    const friendly = getErrorMessage(squadError);
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-emerald-50 via-white to-indigo-50">
          <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <section className="rounded-2xl border border-red-100 bg-white/80 p-4 shadow-md shadow-red-50">
              <p className="text-sm text-red-600">{friendly}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5"
              >
                Try again
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-emerald-50 via-white to-indigo-50">
        <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          <section className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/80 px-5 py-4 shadow-xl shadow-emerald-50 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {currentSquad ? currentSquad.name : "Welcome to SquadBuilder"}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {currentUserRole === "COACH"
                  ? "Manage your squad, fixtures, and lineups from one place."
                  : "See your next match, lineup status, and availability at a glance."}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 text-sm md:items-end">
              {currentUser && (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{currentUser.email}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] uppercase tracking-wide">
                    {currentUserRole}
                  </span>
                </div>
              )}

              <Link
                to="/fixtures"
                className="inline-flex items-center rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:-translate-y-0.5"
              >
                View all fixtures
              </Link>
            </div>
          </section>

          {currentSquad ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <SquadCard />
                <NextFixtureCard />
              </div>
              <div className="flex justify-center">
                <section className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-100 transition-all duration-300 hover:shadow-emerald-200/70 hover:shadow-xl hover:-translate-y-1 hover:bg-white">
                  <h2 className="mb-3 text-base font-semibold text-slate-900 text-center">
                    Quick tips
                  </h2>

                  <ul className="space-y-3 w-full text-left">
                    {[
                      "Confirm lineup before match day.",
                      "Ask players to update availability early.",
                      "Use the Fixtures page to plan ahead.",
                    ].map((tip) => (
                      <li key={tip}>
                        <div className="group flex items-start gap-3 rounded-xl bg-white/70 backdrop-blur-sm border border-emerald-100 px-4 py-3 shadow-md shadow-emerald-50 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-emerald-200/60 hover:border-emerald-200 hover:-translate-y-0.5">
                          <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600 group-hover:scale-125" />
                          <span className="text-sm font-medium text-slate-800 transition-all duration-300 group-hover:text-emerald-800">
                            {tip}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          ) : currentUserRole === "COACH" ? (
            <CreateSquadCard />
          ) : (
            <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-md shadow-emerald-50">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Your Squad
              </h2>
              <p className="text-sm text-slate-700">
                You are not in a squad yet. Your coach can invite you using your
                email address.
              </p>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
