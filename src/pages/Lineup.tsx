import { useParams } from "react-router-dom";
import {
  useGetLineupQuery,
  useSaveLineupMutation,
} from "../features/lineups/lineups.api";
import LineupEditor from "../features/lineups/components/LineupEditor";
import { useState } from "react";
import Header from "../components/Header";
import { toast } from "sonner";

export default function Lineup() {
  const params = useParams<{ fixtureId: string }>();
  const fixtureId = Number(params.fixtureId);
  const isBadId = !fixtureId || Number.isNaN(fixtureId);

  const {
    data: lineup,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLineupQuery(fixtureId, {
    skip: isBadId,
  });

  const [saveLineup, { isLoading: isSaving }] = useSaveLineupMutation();
  const [isStartingDraft, setIsStartingDraft] = useState(false);

  async function handleStartDraft() {
    if (isBadId) return;
    setIsStartingDraft(true);
    try {
      await saveLineup({ fixtureId, players: [] }).unwrap();
      toast.success("Draft created");
      await refetch();
    } catch (err) {
      console.error("Start draft error", err);
      toast.error("Failed to start draft");
    } finally {
      setIsStartingDraft(false);
    }
  }

  if (isBadId) {
    return <div className="p-4">Invalid fixture id.</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading lineup…</div>;
  }

  if (isError) {
    const status = (error as { status?: number })?.status;
    if (status === 404) {
      return (
        <>
          <Header />
          <main className="mx-auto max-w-3xl p-4 space-y-4">
            <h1 className="text-xl font-semibold">Lineup</h1>
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm mb-3">No lineup yet for this fixture.</p>
              <button
                onClick={handleStartDraft}
                disabled={isStartingDraft}
                className="rounded-md bg-indigo-600 px-3 py-2 text-white text-sm disabled:opacity-60"
              >
                {isStartingDraft ? "Starting…" : "Start Draft"}
              </button>
            </div>
          </main>
        </>
      );
    }
    return <div className="p-4">Failed to load lineup ({status ?? "?"})</div>;
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl p-4">
        <h1 className="text-xl font-semibold mb-4">Lineup</h1>
        <LineupEditor fixtureId={fixtureId} initialLineup={lineup} />
      </main>
    </>
  );
}
