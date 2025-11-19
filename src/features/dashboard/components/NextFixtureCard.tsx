import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  useMySquadQuery,
  useFixturesForSquadQuery,
  useLineupByFixtureQuery,
} from "../dashboard.api";
import { getErrorMessage } from "../../../utils/error";

export default function NextFixtureCard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data: squad, isLoading: isSquadLoading } = useMySquadQuery();

  const {
    data: fixtures,
    isLoading: isFixturesLoading,
    isError: hasFixturesError,
    error: fixturesError,
    refetch: refetchFixtures,
  } = useFixturesForSquadQuery(squad?.id ?? 0, {
    skip: !squad?.id,
  });

  const nextFixture =
    fixtures
      ?.filter((fixture) => fixture.status === "UPCOMING" || !fixture.status)
      .sort(
        (a, b) =>
          new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime()
      )[0] ?? null;

  const {
    data: lineup,
    isLoading: isLineupLoading,
    isError: hasLineupError,
    error: lineupError,
    refetch: refetchLineup,
  } = useLineupByFixtureQuery(nextFixture?.id ?? 0, {
    skip: !nextFixture?.id,
  });

  if (isSquadLoading || isFixturesLoading) {
    return (
      <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-50">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Next Fixture
        </h2>
        <p className="text-sm text-slate-600">Loading…</p>
      </section>
    );
  }

  if (hasFixturesError) {
    const friendly = getErrorMessage(fixturesError);

    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-5 shadow-lg shadow-red-50 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Next Fixture</h2>
        <p className="text-sm text-red-600">{friendly}</p>
        <button
          onClick={() => refetchFixtures()}
          className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!nextFixture) {
    return (
      <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-50">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Next Fixture
        </h2>
        <p className="text-sm text-slate-700">No upcoming fixture.</p>
      </section>
    );
  }

  const isPublished = !!lineup?.published;
  const isSelected =
    !!lineup?.selectedPlayerIds &&
    !!currentUser?.id &&
    lineup.selectedPlayerIds.includes(currentUser.id);

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-emerald-200/70">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">
        Next Fixture
      </h2>

      <div className="text-sm">
        <p className="font-medium text-slate-900">{nextFixture.opponent}</p>
        <p className="text-slate-500">
          {new Date(nextFixture.kickoffAt).toLocaleString()}
          {nextFixture.location && ` — ${nextFixture.location}`}
        </p>
        {nextFixture.notes && (
          <p className="mt-1 text-xs text-slate-600">{nextFixture.notes}</p>
        )}
      </div>

      {isLineupLoading ? (
        <p className="mt-3 text-xs text-slate-500">Checking lineup…</p>
      ) : hasLineupError ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-red-600">{getErrorMessage(lineupError)}</p>
          <button
            onClick={() => refetchLineup()}
            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5"
          >
            Try again
          </button>
        </div>
      ) : isPublished ? (
        <div
          className={`
            mt-3 rounded-xl px-3 py-2 text-xs font-medium
            ${
              isSelected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }
          `}
        >
          {isSelected
            ? "You're selected for this match."
            : "Lineup published. You are not selected."}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-600">Lineup not published yet.</p>
      )}

      <div className="mt-4">
        <Link
          to={`/fixtures/${nextFixture.id}`}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5"
        >
          View & Set Availability
        </Link>
      </div>
    </section>
  );
}
