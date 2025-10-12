import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  useFixturesBySquadQuery,
  useDeleteFixtureMutation,
} from "../fixtures.api";
import EditFixtureForm from "./EditFixtureForm";

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
    refetch,
  } = useFixturesBySquadQuery(squadId, { skip: !squadId });

  const [deleteFixture, { isLoading: isDeleting }] = useDeleteFixtureMutation();
  const [editingFixtureId, setEditingFixtureId] = useState<number | null>(null);

  async function handleDelete(fixtureId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fixture?"
    );
    if (!confirmed) return;

    try {
      await deleteFixture(fixtureId).unwrap();
      await refetch();
    } catch {
      alert("Failed to delete fixture. Please try again.");
    }
  }

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
        {fixtures.map((fixture) => {
          const isEditing = editingFixtureId === fixture.id;

          return (
            <li key={fixture.id} className="py-3 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    vs {fixture.opponent}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(fixture.kickoffAt).toLocaleString()}
                    {fixture.location && ` - ${fixture.location}`}
                    {fixture.notes && ` - ${fixture.notes}`}
                  </p>
                </div>

                <div className="mt-2 sm:mt-0 flex flex-wrap gap-3">
                  <Link
                    to={`/fixtures/${fixture.id}`}
                    className="text-sm text-emerald-700 hover:underline"
                  >
                    View details
                  </Link>

                  {currentUserRole === "COACH" && (
                    <>
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => setEditingFixtureId(fixture.id)}
                            className="text-sm text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(fixture.id)}
                            disabled={isDeleting}
                            className="text-sm text-red-600 hover:underline disabled:opacity-60"
                          >
                            {isDeleting ? "Deleting…" : "Delete"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingFixtureId(null)}
                          className="text-sm text-gray-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isEditing && currentUserRole === "COACH" && (
                <EditFixtureForm
                  fixtureId={fixture.id}
                  initialOpponent={fixture.opponent}
                  initialKickoffISO={fixture.kickoffAt}
                  initialLocation={fixture.location ?? ""}
                  initialNotes={fixture.notes ?? ""}
                  onSaved={async () => {
                    setEditingFixtureId(null);
                    await refetch();
                  }}
                  onCancel={() => setEditingFixtureId(null)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
