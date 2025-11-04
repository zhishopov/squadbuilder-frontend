import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  useFixtureByIdQuery,
  useSetAvailabilityMutation,
} from "../features/fixtures/fixtures.api";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useGetLineupQuery } from "../features/lineups/lineups.api";
import {
  getErrorStatus,
  getErrorMessage,
  showErrorToast,
} from "../utils/error";

function formatDateTime(isoString: string | null) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function FixtureDetails() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const params = useParams<{ id: string }>();
  const fixtureId = Number(params.id);
  const isBadId = !fixtureId || Number.isNaN(fixtureId);

  const {
    data: fixture,
    isLoading,
    isError,
    error,
    refetch,
  } = useFixtureByIdQuery(fixtureId, { skip: isBadId });

  const [setAvailability, { isLoading: isSaving }] =
    useSetAvailabilityMutation();

  const myExistingChoice = useMemo(() => {
    if (!fixture || !Array.isArray(fixture.availability) || !currentUser?.id) {
      return "";
    }
    const mine = fixture.availability.find(
      (row) => row.userId === currentUser.id
    );
    return (mine?.availability as "YES" | "NO" | "MAYBE" | undefined) ?? "";
  }, [fixture, currentUser?.id]);

  const [playerChoice, setPlayerChoice] = useState<"YES" | "NO" | "MAYBE" | "">(
    myExistingChoice
  );

  useEffect(() => {
    if (playerChoice === "" && myExistingChoice !== "") {
      setPlayerChoice(myExistingChoice);
    }
  }, [myExistingChoice, playerChoice]);

  const envBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
  const fallbackBaseUrl =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:4000"
      : window.location.origin;
  const apiBase = envBaseUrl ?? fallbackBaseUrl;

  const [isSubmittingAvailability, setIsSubmittingAvailability] =
    useState(false);

  const { data: lineup } = useGetLineupQuery(fixture?.id ?? 0, {
    skip: !fixture?.id,
  });

  async function handleSaveAvailability() {
    if (!playerChoice || !fixture) return;

    setIsSubmittingAvailability(true);
    try {
      const response = await fetch(
        `${apiBase}/fixtures/${fixture.id}/availability`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            availability: String(playerChoice).toUpperCase(),
          }),
        }
      );

      if (!response.ok) {
        const errorJson = await response
          .json()
          .catch(() => ({ error: `HTTP ${response.status}` }));
        throw { status: response.status, data: errorJson };
      }

      toast.success("Availability saved");
      await refetch();
    } catch (caughtError) {
      showErrorToast(caughtError);
    } finally {
      setIsSubmittingAvailability(false);
    }
  }

  async function handleCoachSetAvailability(
    userId: number,
    choice: "YES" | "NO" | "MAYBE"
  ) {
    if (!fixture) return;
    const numericUserId = Number(userId);

    setIsSubmittingAvailability(true);
    try {
      const response = await fetch(
        `${apiBase}/fixtures/${fixture.id}/availability`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            availability: String(choice).toUpperCase(),
            userId: numericUserId,
          }),
        }
      );

      if (!response.ok) {
        const errorJson = await response
          .json()
          .catch(() => ({ error: `HTTP ${response.status}` }));
        throw { status: response.status, data: errorJson };
      }

      toast.success("Availability updated");
      await refetch();
    } catch (caughtError) {
      showErrorToast(caughtError);
    } finally {
      setIsSubmittingAvailability(false);
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
              {getErrorMessage(error)} (status {getErrorStatus(error) ?? "?"})
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
                {formatDateTime(fixture.kickoffAt)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Location:</span>{" "}
                {fixture.location ?? "—"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Notes:</span>{" "}
                {fixture.notes ?? "—"}
              </p>

              {currentUser?.role === "COACH" && (
                <div className="mt-4">
                  <Link
                    to={`/lineup/${fixture.id}`}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700"
                  >
                    Manage Lineup
                  </Link>
                </div>
              )}
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
                        onChange={(event) =>
                          setPlayerChoice(
                            event.currentTarget.value as "YES" | "NO" | "MAYBE"
                          )
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleSaveAvailability}
                  disabled={
                    !playerChoice || isSaving || isSubmittingAvailability
                  }
                  className="rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving || isSubmittingAvailability ? "Saving…" : "Save"}
                </button>
              </section>
            )}

            {(lineup?.status === "PUBLISHED" ||
              currentUser?.role === "COACH") && (
              <section className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                  {lineup?.status === "PUBLISHED"
                    ? "Published Lineup"
                    : "Current Lineup"}
                </h2>

                {!lineup || (lineup.players ?? []).length === 0 ? (
                  <p className="text-sm text-gray-700">No lineup yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {lineup.players.map((playerRow) => {
                      const emailLabel =
                        fixture.availability?.find(
                          (row) => row.userId === playerRow.userId
                        )?.email ?? "Unknown";

                      return (
                        <li
                          key={`${playerRow.userId}-${playerRow.orderNumber}`}
                          className="py-2 text-sm flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{emailLabel}</p>
                          </div>
                          <div className="text-gray-700">
                            {playerRow.isStarter ? "Starter" : "Bench"}
                            {playerRow.position
                              ? ` (${playerRow.position})`
                              : ""}
                            {typeof playerRow.orderNumber === "number"
                              ? ` • #${playerRow.orderNumber}`
                              : ""}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}

            {currentUser?.role === "COACH" && (
              <section className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                  Players Availability
                </h2>

                {(fixture.availability ?? []).length === 0 ? (
                  <p className="text-sm text-gray-700">No responses yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {(fixture.availability ?? []).map((player) => (
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
                              disabled={isSaving || isSubmittingAvailability}
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
