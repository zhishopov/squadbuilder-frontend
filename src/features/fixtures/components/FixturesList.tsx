import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useFixturesBySquadQuery } from "../fixtures.api";

type FixturesListProps = {
  squadId: number;
};

export default function FixturesList({ squadId }: FixturesListProps) {
  const currentUserRole =
    useSelector((state: RootState) => state.auth.user?.role) ?? null;

  const {
    data: fixtures,
    isLoading,
    isError,
    error,
  } = useFixturesBySquadQuery(squadId, { skip: !squadId });

  if (isLoading) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Fixtures</h2>
        <p className="text-sm text-gray-600">Loading fixtures…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Fixtures</h2>
        <p className="text-sm text-red-600">
          Failed to load fixtures (status
          {(error as { status?: number })?.status ?? "?"})
        </p>
      </section>
    );
  }

  if (!fixtures || fixtures.length === 0) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Fixtures</h2>
        <p className="text-sm text-gray-700">
          No fixtures scheduled yet.
          {currentUserRole === "COACH" && " Create one below."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Fixtures</h2>

      <ul className="divide-y divide-gray-100">
        {fixtures.map((fixture) => (
          <li
            key={fixture.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">vs {fixture.opponent}</p>
              <p className="text-sm text-gray-600">
                {new Date(fixture.date).toLocaleString()}
                {fixture.location &&
                  ` - ${fixture.location} - ${fixture.notes}`}
              </p>
            </div>

            {currentUserRole === "COACH" && (
              <div className="mt-2 sm:mt-0 flex gap-2">
                <button className="text-sm text-indigo-600 hover:underline">
                  Edit
                </button>
                <button className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
