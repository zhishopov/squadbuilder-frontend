import { useParams } from "react-router-dom";
import { useGetLineupQuery } from "../features/lineups/lineups.api";
import LineupEditor from "../features/lineups/components/LineupEditor";
import Header from "../components/Header";
import { getErrorStatus, getErrorMessage } from "../utils/error";

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

  const statusCode = getErrorStatus(error);
  const errorMessage = getErrorMessage(error);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl p-4">
        <h1 className="text-xl font-semibold mb-4">Lineup</h1>
        <LineupEditor fixtureId={fixtureId} />
        {isError && statusCode && statusCode !== 404 && (
          <div className="text-sm text-red-600 mt-3">
            Failed to load lineup{statusCode ? ` (${statusCode})` : ""}:
            {errorMessage}
          </div>
        )}
      </main>
    </>
  );
}
