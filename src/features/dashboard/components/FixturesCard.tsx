import { useMySquadQuery, useFixturesForSquadQuery } from "../dashboard.api";
import { getErrorMessage } from "../../../utils/error";

export default function FixturesCard() {
  const { data: squad, isLoading: squadLoading } = useMySquadQuery();

  const {
    data: fixtures,
    isLoading: fixturesLoading,
    isError,
    error,
    refetch,
  } = useFixturesForSquadQuery(squad?.id ?? 0, {
    skip: !squad?.id,
  });

  if (squadLoading || fixturesLoading) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Upcoming Fixtures</h2>
        <p className="text-sm text-gray-600">Loading fixtures…</p>
      </section>
    );
  }

  if (isError) {
    const friendly = getErrorMessage(error);
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold mb-2">Upcoming Fixtures</h2>
        <p className="text-sm text-red-600">{friendly}</p>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-white text-sm hover:bg-gray-700"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!fixtures || fixtures.length === 0) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Upcoming Fixtures</h2>
        <p className="text-sm text-gray-700">No fixtures yet.</p>
      </section>
    );
  }

  const upcomingFixtures = fixtures.filter(
    (fixture) => fixture.status === "UPCOMING" || !fixture.status
  );

  if (upcomingFixtures.length === 0) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Upcoming Fixtures</h2>
        <p className="text-sm text-gray-700">
          No upcoming fixtures found — check back soon.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Upcoming Fixtures</h2>
      <ul className="divide-y divide-gray-100">
        {upcomingFixtures.map((fixture) => (
          <li key={fixture.id} className="py-2 text-sm">
            <p className="font-medium">{fixture.opponent}</p>
            <p className="text-gray-500">
              {new Date(fixture.kickoffAt).toLocaleString()}
              {fixture.location && ` — ${fixture.location}`}
            </p>
            {fixture.notes && (
              <p className="text-xs text-gray-600 mt-1">{fixture.notes}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}