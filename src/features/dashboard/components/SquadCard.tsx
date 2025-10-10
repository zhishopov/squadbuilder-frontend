import { useMySquadQuery, useSquadMembersQuery } from "../dashboard.api";

export default function SquadCard() {
  const {
    data: currentSquad,
    isLoading: isSquadLoading,
    isError: isSquadError,
    error: squadError,
  } = useMySquadQuery();

  const squadId = currentSquad?.id ?? 0;

  const {
    data: squadMembers,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useSquadMembersQuery(squadId, { skip: !squadId });

  if (isSquadLoading || isMembersLoading) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-gray-600">Loading squad…</p>
      </section>
    );
  }

  if (isSquadError) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-red-600">
          Failed to load squad (status
          {(squadError as { status?: number })?.status ?? "?"})
        </p>
      </section>
    );
  }

  if (!currentSquad) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-gray-700">You don't have a squad yet.</p>
      </section>
    );
  }

  if (isMembersError) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-red-600">Failed to load members.</p>
      </section>
    );
  }

  const memberCount = squadMembers?.length ?? 0;

  return (
    <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
      <p className="text-sm">
        <span className="font-medium">Name:</span> {currentSquad.name}
      </p>
      <p className="text-sm">
        <span className="font-medium">Members:</span> {memberCount}
      </p>
    </section>
  );
}
