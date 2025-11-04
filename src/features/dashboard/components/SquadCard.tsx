import { useMySquadQuery, useSquadMembersQuery } from "../dashboard.api";
import { getErrorMessage } from "../../../utils/error";

export default function SquadCard() {
  const {
    data: currentSquad,
    isLoading: isSquadLoading,
    isError: hasSquadError,
    error: squadError,
    refetch: refetchSquad,
  } = useMySquadQuery();

  const squadId = currentSquad?.id ?? 0;

  const {
    data: squadMembers,
    isLoading: isMembersLoading,
    isError: hasMembersError,
    error: membersError,
    refetch: refetchMembers,
  } = useSquadMembersQuery(squadId, { skip: !squadId });

  if (isSquadLoading || isMembersLoading) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-gray-600">Loading squad…</p>
      </section>
    );
  }

  if (hasSquadError) {
    const friendly = getErrorMessage(squadError);
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-red-600">{friendly}</p>
        <button
          onClick={() => refetchSquad()}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-white text-sm hover:bg-gray-700"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!currentSquad) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-gray-700">You don’t have a squad yet.</p>
      </section>
    );
  }

  if (hasMembersError) {
    const friendly = getErrorMessage(membersError);
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-red-600">{friendly}</p>
        <button
          onClick={() => refetchMembers()}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-white text-sm hover:bg-gray-700"
        >
          Try again
        </button>
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