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
      <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-50 transition-all">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Your Squad
        </h2>
        <p className="text-sm text-slate-600">Loading squad…</p>
      </section>
    );
  }

  if (hasSquadError) {
    const friendly = getErrorMessage(squadError);

    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-5 shadow-lg shadow-red-50 space-y-3 transition-all">
        <h2 className="text-lg font-semibold text-slate-900">Your Squad</h2>
        <p className="text-sm text-red-600">{friendly}</p>

        <button
          onClick={() => refetchSquad()}
          className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!currentSquad) {
    return (
      <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-50 transition-all">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Your Squad
        </h2>
        <p className="text-sm text-slate-700">You don’t have a squad yet.</p>
      </section>
    );
  }

  if (hasMembersError) {
    const friendly = getErrorMessage(membersError);

    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-5 shadow-lg shadow-red-50 space-y-3 transition-all">
        <h2 className="text-lg font-semibold text-slate-900">Your Squad</h2>
        <p className="text-sm text-red-600">{friendly}</p>

        <button
          onClick={() => refetchMembers()}
          className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5"
        >
          Try again
        </button>
      </section>
    );
  }

  const memberCount = squadMembers?.length ?? 0;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-lg shadow-emerald-100 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/70 hover:-translate-y-1 hover:bg-white">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Your Squad</h2>

      <p className="text-sm text-slate-700 mb-1">
        <span className="font-semibold text-emerald-700">Name:</span>{" "}
        {currentSquad.name}
      </p>

      <p className="text-sm text-slate-700">
        <span className="font-semibold text-emerald-700">Members:</span>{" "}
        {memberCount}
      </p>
    </section>
  );
}
