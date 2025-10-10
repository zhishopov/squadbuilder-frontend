import Header from "../components/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useMySquadQuery } from "../features/dashboard/dashboard.api";
import SquadCard from "../features/dashboard/components/SquadCard";
import MembersCard from "../features/dashboard/components/MembersCard";
import FixturesCard from "../features/dashboard/components/FixturesCard";
import NextFixtureCard from "../features/dashboard/components/NextFixtureCard";
import AvailabilityCard from "../features/dashboard/components/AvailabilityCard";
import CreateSquadCard from "../features/squads/components/CreateSquadCard";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserRole = currentUser?.role ?? null;

  const {
    data: currentSquad,
    isLoading: isSquadLoading,
    isError: isSquadError,
  } = useMySquadQuery();

  if (isSquadLoading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  if (isSquadError) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-red-600">Failed to load squad.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header></Header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {currentSquad ? (
          <>
            <SquadCard></SquadCard>
            <MembersCard></MembersCard>
            <FixturesCard></FixturesCard>
            <NextFixtureCard></NextFixtureCard>
            <AvailabilityCard></AvailabilityCard>
          </>
        ) : currentUserRole === "COACH" ? (
          <CreateSquadCard></CreateSquadCard>
        ) : (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
            <p className="text-sm text-gray-700">You are not in a squad yet.</p>
          </section>
        )}
      </main>
    </>
  );
}
