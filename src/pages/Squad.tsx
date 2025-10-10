import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  useMySquadQuery,
  useSquadMembersQuery,
} from "../features/dashboard/dashboard.api";
import MembersList from "../features/squads/components/MembersList";

export default function Squad() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userRole = currentUser?.role ?? null;

  const {
    data: mySquad,
    isLoading: isSquadLoading,
    isError: isSquadError,
    error: squadError,
  } = useMySquadQuery();

  const squadId = mySquad?.id ?? 0;
  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useSquadMembersQuery(squadId, { skip: !squadId });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">My Squad</h1>

        {isSquadLoading && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Loading squad…</p>
          </section>
        )}

        {isSquadError && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-red-600">
              Failed to load squad (status
              {(squadError as { status?: number })?.status ?? "?"})
            </p>
          </section>
        )}

        {!isSquadLoading && !mySquad && userRole === "COACH" && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">
              You don't have a squad yet. Go to your{" "}
              <Link to="/dashboard" className="text-emerald-700 underline">
                Dashboard
              </Link>{" "}
              to create one.
            </p>
          </section>
        )}

        {!isSquadLoading && !mySquad && userRole === "PLAYER" && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">
              You are not part of a squad yet.
            </p>
          </section>
        )}

        {mySquad && (
          <>
            <section className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">{mySquad.name}</h2>
              {isMembersLoading ? (
                <p className="text-sm text-gray-600">Loading members…</p>
              ) : isMembersError ? (
                <p className="text-sm text-red-600">
                  Failed to load members (status
                  {(membersError as { status?: number })?.status ?? "?"})
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Members: {members?.length ?? "—"}
                </p>
              )}
            </section>

            <MembersList squadId={mySquad.id} />
          </>
        )}
      </main>
    </>
  );
}
