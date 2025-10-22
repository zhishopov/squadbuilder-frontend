import { useParams } from "react-router-dom";
import { useGetLineupQuery } from "../features/lineups/lineups.api";
import LineupEditor from "../features/lineups/components/LineupEditor";
import Header from "../components/Header";

export default function Lineup() {
  const params = useParams<{ fixtureId: string }>();
  const fixtureId = Number(params.fixtureId);
  const isBadId = !fixtureId || Number.isNaN(fixtureId);

  const { isLoading, isError, error } = useGetLineupQuery(fixtureId, {
    skip: isBadId,
    refetchOnMountOrArgChange: true,
  });

  if (isBadId) {
    return <div className="p-4">Invalid fixture id.</div>;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl p-4">
          <h1 className="text-xl font-semibold">Lineup</h1>
          <div className="text-sm text-gray-600 mt-2">Loading lineup…</div>
        </main>
      </>
    );
  }

  const httpStatus = (error as { status?: number })?.status;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl p-4">
        <h1 className="text-xl font-semibold mb-4">Lineup</h1>
        <LineupEditor fixtureId={fixtureId} />
        {isError && httpStatus && httpStatus !== 404 && (
          <div className="text-sm text-red-600 mt-3">
            Failed to load lineup ({httpStatus})
          </div>
        )}
      </main>
    </>
  );
}
