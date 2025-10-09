import { useMySquadQuery } from "../dashboard.api";

export default function SquadCard() {
  const { data: squad, isLoading, isError, error } = useMySquadQuery();

  if (isLoading) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-gray-600">Loading squad…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-red-600">
          Failed to load squad (status
          {(error as { status?: number })?.status || "?"})
        </p>
      </section>
    );
  }

  if (!squad) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
        <p className="text-sm text-gray-700">You don't have a squad yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Your Squad</h2>
      <p className="text-sm">
        <span className="font-medium">Name:</span> {squad.name}
      </p>
      <p className="text-sm">
        <span className="font-medium">Members:</span>
        {squad.membersCount ?? "—"}
      </p>
    </section>
  );
}
