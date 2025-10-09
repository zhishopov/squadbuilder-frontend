import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  useMySquadQuery,
  useFixturesForSquadQuery,
  useSetAvailabilityMutation,
  type Fixture,
} from "../dashboard.api";

function getNextUpcomingFixture(allFixtures: Fixture[] | undefined) {
  if (!allFixtures || allFixtures.length === 0) return null;

  const currentTime = Date.now();

  const upcomingFixtures = allFixtures.filter((fixture) => {
    const fixtureTime = new Date(fixture.date).getTime();
    const isFuture = !Number.isNaN(fixtureTime) && fixtureTime >= currentTime;
    const isUpcoming = !fixture.status || fixture.status === "UPCOMING";
    return isFuture && isUpcoming;
  });

  if (upcomingFixtures.length === 0) return null;

  upcomingFixtures.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return upcomingFixtures[0];
}

export default function AvailabilityCard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isPlayer = currentUser?.role === "PLAYER";

  const { data: currentSquad, isLoading: isSquadLoading } = useMySquadQuery();

  const {
    data: allFixtures,
    isLoading: isFixturesLoading,
    isError: isFixturesError,
  } = useFixturesForSquadQuery(currentSquad?.id ?? 0, {
    skip: !currentSquad?.id,
  });

  const [
    setPlayerAvailability,
    {
      isLoading: isSavingAvailability,
      isError: isAvailabilitySaveError,
      isSuccess: isAvailabilitySaved,
    },
  ] = useSetAvailabilityMutation();

  const nextFixture = useMemo(
    () => getNextUpcomingFixture(allFixtures),
    [allFixtures]
  );

  if (!isPlayer) return null;

  async function availabilityChangeHandler(status: "YES" | "NO" | "MAYBE") {
    if (!nextFixture) return;
    try {
      await setPlayerAvailability({
        fixtureId: nextFixture.id,
        status,
      }).unwrap();
    } catch (error) {
      console.error("Failed to set availability:", error);
    }
  }

  if (isSquadLoading || isFixturesLoading) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Availability</h2>
        <p className="text-sm text-gray-600">
          Loading your squad and fixtures…
        </p>
      </section>
    );
  }

  if (isFixturesError) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Availability</h2>
        <p className="text-sm text-red-600">
          Could not load fixtures. Please try again later.
        </p>
      </section>
    );
  }

  if (!currentSquad) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Availability</h2>
        <p className="text-sm text-gray-700">You are not in a squad yet.</p>
      </section>
    );
  }

  if (!nextFixture) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Availability</h2>
        <p className="text-sm text-gray-700">No upcoming fixtures found.</p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Your Availability</h2>

      <p className="text-sm text-gray-600 mb-3">
        Next Match: <span className="font-medium">{nextFixture.opponent}</span>
        {new Date(nextFixture.date).toLocaleString()}
        {nextFixture.location ? `${nextFixture.location}` : ""}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => availabilityChangeHandler("YES")}
          disabled={isSavingAvailability}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSavingAvailability ? "Saving…" : "YES"}
        </button>

        <button
          onClick={() => availabilityChangeHandler("NO")}
          disabled={isSavingAvailability}
          className="rounded-md bg-rose-600 px-3 py-1.5 text-white text-sm hover:bg-rose-700 disabled:opacity-60"
        >
          {isSavingAvailability ? "Saving…" : "NO"}
        </button>

        <button
          onClick={() => availabilityChangeHandler("MAYBE")}
          disabled={isSavingAvailability}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-white text-sm hover:bg-amber-600 disabled:opacity-60"
        >
          {isSavingAvailability ? "Saving…" : "MAYBE"}
        </button>
      </div>

      {isAvailabilitySaved && (
        <p className="mt-2 text-sm text-emerald-700">
          Availability updated successfully.
        </p>
      )}
      {isAvailabilitySaveError && (
        <p className="mt-2 text-sm text-red-600">
          Could not save your availability. Please try again.
        </p>
      )}
    </section>
  );
}
