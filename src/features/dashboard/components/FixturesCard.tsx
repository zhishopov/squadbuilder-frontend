import { useMySquadQuery, useFixturesForSquadQuery } from "../dashboard.api";

export default function FixturesCard() {
  const { data: squad, isLoading: squadLoading } = useMySquadQuery();

  const {
    data: fixtures,
    isLoading: fixturesLoading,
    isError,
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
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Upcoming Fixtures</h2>
        <p className="text-sm text-red-600">Failed to load fixtures.</p>
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
