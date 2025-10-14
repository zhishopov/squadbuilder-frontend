import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  useFixtureByIdQuery,
  useSetAvailabilityMutation,
} from "../features/fixtures/fixtures.api";
import { useState } from "react";
import { toast } from "sonner";

type NormalizedFixture = {
  id: number;
  squadId: number;
  opponent: string;
  dateISO: string | null;
  location?: string | null;
  notes?: string | null;
  availability?: Array<{
    userId: number;
    email: string;
    role: "COACH" | "PLAYER";
    availability: "YES" | "NO" | "MAYBE";
    updatedAt: string | Date;
  }>;
};

function normalizeFixture(fixtureResponse: unknown): NormalizedFixture | null {
  if (!fixtureResponse || typeof fixtureResponse !== "object") return null;
  const fixtureData = fixtureResponse as Record<string, unknown>;
  const dateLike = fixtureData.kickoffAt ?? fixtureData.date ?? null;
  const dateISO = dateLike ? new Date(dateLike as string).toISOString() : null;

  return {
    id: Number(fixtureData.id),
    squadId: Number(fixtureData.squadId ?? fixtureData.squad_id),
    opponent: String(fixtureData.opponent ?? ""),
    dateISO,
    location: (fixtureData.location ?? null) as string | null,
    notes: (fixtureData.notes ?? null) as string | null,
    availability: Array.isArray(fixtureData.availability)
      ? (fixtureData.availability as NormalizedFixture["availability"])
      : undefined,
  };
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function FixtureDetails() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const params = useParams<{ id: string }>();
  const fixtureId = Number(params.id);
  const isBadId = !fixtureId || Number.isNaN(fixtureId);

  const {
    data: rawFixture,
    isLoading,
    isError,
    error,
    refetch,
  } = useFixtureByIdQuery(fixtureId, { skip: isBadId });

  const fixture = normalizeFixture(rawFixture ?? null);
  const [setAvailability, { isLoading: isSaving }] =
    useSetAvailabilityMutation();
  const [playerChoice, setPlayerChoice] = useState<"YES" | "NO" | "MAYBE" | "">(
    ""
  );

  async function handleSaveAvailability() {
    if (!playerChoice || !fixture) return;

    try {
      await setAvailability({
        fixtureId: fixture.id,
        availability: playerChoice,
      }).unwrap();

      toast.success("Availability saved");
      await refetch();
    } catch {
      toast.error("Failed to save availability");
    }
  }

  async function handleCoachSetAvailability(
    userId: number,
    choice: "YES" | "NO" | "MAYBE"
  ) {
    if (!fixture) return;

    try {
      await setAvailability({
        fixtureId: fixture.id,
        availability: choice,
        userId,
      }).unwrap();

      toast.success("Availability updated");
      await refetch();
    } catch {
      toast.error("Failed to update availability");
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Fixture Details</h1>
            <Link to="/squad" className="text-emerald-700 underline text-sm">
              Back to Squad
            </Link>
          </div>
        </section>

        {isBadId && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-red-600">Invalid fixture id.</p>
          </section>
        )}

        {isLoading && !isBadId && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Loading fixture…</p>
          </section>
        )}

        {isError && !isBadId && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-red-600">
              Failed to load fixture (status
              {(error as { status?: number })?.status ?? "?"})
            </p>
          </section>
        )}

        {!isLoading && !isError && !isBadId && !fixture && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">Fixture not found.</p>
          </section>
        )}

        {fixture && (
          <>
            <section className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-sm">
                <span className="font-medium">Opponent:</span>{" "}
                {fixture.opponent || "—"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Kickoff:</span>{" "}
                {formatDateTime(fixture.dateISO)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Location:</span>{" "}
                {fixture.location ?? "—"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Notes:</span>{" "}
                {fixture.notes ?? "—"}
              </p>
            </section>

            {currentUser?.role === "PLAYER" && (
              <section className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">
                  Your Availability
                </h2>
                <div className="flex items-center gap-4 mb-3">
                  {["YES", "NO", "MAYBE"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-1 text-sm"
                    >
                      <input
                        type="radio"
                        name="availability"
                        value={option}
                        checked={playerChoice === option}
                        onChange={() =>
                          setPlayerChoice(option as "YES" | "NO" | "MAYBE")
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleSaveAvailability}
                  disabled={!playerChoice || isSaving}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving ? "Saving…" : "Save"}
                </button>
              </section>
            )}

            {currentUser?.role === "COACH" &&
              Array.isArray(fixture.availability) && (
                <section className="rounded-xl border bg-white p-4 shadow-sm">
                  <h2 className="text-lg font-semibold mb-2">
                    Players Availability
                  </h2>

                  {fixture.availability.length === 0 ? (
                    <p className="text-sm text-gray-700">No responses yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {fixture.availability.map((player) => (
                        <li
                          key={`${player.userId}-${player.updatedAt}`}
                          className="py-2 text-sm flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{player.email}</p>
                            <p className="text-gray-500 uppercase">
                              {player.role}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {["YES", "NO", "MAYBE"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleCoachSetAvailability(
                                    player.userId,
                                    option as "YES" | "NO" | "MAYBE"
                                  )
                                }
                                className={`px-2 py-1 rounded text-xs ${
                                  player.availability === option
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
          </>
        )}
      </main>
    </>
  );
}
