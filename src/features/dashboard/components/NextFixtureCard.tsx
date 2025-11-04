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
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Next Fixture</h2>
        <p className="text-sm text-gray-600">Loading…</p>
      </section>
    );
  }

  if (hasFixturesError) {
    const friendly = getErrorMessage(fixturesError);
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold mb-2">Next Fixture</h2>
        <p className="text-sm text-red-600">{friendly}</p>
        <button
          onClick={() => refetchFixtures()}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-white text-sm hover:bg-gray-700"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!nextFixture) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Next Fixture</h2>
        <p className="text-sm text-gray-700">No upcoming fixture.</p>
      </section>
    );
  }

  const isPublished = !!lineup?.published;
  const isSelected =
    !!lineup?.selectedPlayerIds &&
    !!currentUser?.id &&
    lineup.selectedPlayerIds.includes(currentUser.id);

  return (
    <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Next Fixture</h2>

      <div className="text-sm">
        <p className="font-medium">{nextFixture.opponent}</p>
        <p className="text-gray-500">
          {new Date(nextFixture.kickoffAt).toLocaleString()}
          {nextFixture.location && ` — ${nextFixture.location}`}
        </p>
        {nextFixture.notes && (
          <p className="text-xs text-gray-600 mt-1">{nextFixture.notes}</p>
        )}
      </div>

      {isLineupLoading ? (
        <p className="mt-2 text-xs text-gray-500">Checking lineup…</p>
      ) : hasLineupError ? (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-red-600">
            {getErrorMessage(lineupError)}
          </p>
          <button
            onClick={() => refetchLineup()}
            className="rounded-md bg-gray-800 px-2 py-1 text-white text-xs hover:bg-gray-700"
          >
            Try again
          </button>
        </div>
      ) : isPublished ? (
        <div
          className={`mt-3 rounded-md px-3 py-2 text-xs font-medium ${
            isSelected
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isSelected
            ? "You're selected for this match."
            : "Lineup published. You are not selected."}
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-600">Lineup not published yet.</p>
      )}

      <div className="mt-4">
        <Link
          to={`/fixtures/${nextFixture.id}`}
          className="inline-block rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700"
        >
          View & Set Availability
        </Link>
      </div>
    </section>
  );
}