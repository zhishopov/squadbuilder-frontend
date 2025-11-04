import { useMySquadQuery, useSquadMembersQuery } from "../dashboard.api";
import { getErrorMessage } from "../../../utils/error";

export default function MembersCard() {
  const { data: squad, isLoading: squadLoading } = useMySquadQuery();

  const {
    data: members,
    isLoading: membersLoading,
    isError,
    error,
    refetch,
  } = useSquadMembersQuery(squad?.id ?? 0, {
    skip: !squad?.id,
  });

  if (squadLoading || membersLoading) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Squad Members</h2>
        <p className="text-sm text-gray-600">Loading members…</p>
      </section>
    );
  }

  if (isError) {
    const friendly = getErrorMessage(error);
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold mb-2">Squad Members</h2>
        <p className="text-sm text-red-600">{friendly}</p>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-white text-sm hover:bg-gray-700"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!members || members.length === 0) {
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Squad Members</h2>
        <p className="text-sm text-gray-700">No members in your squad yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Squad Members</h2>
      <ul className="divide-y divide-gray-100">
        {members.map((member) => (
          <li
            key={member.id}
            className="py-2 flex justify-between items-center text-sm"
          >
            <span className="font-medium">{member.email}</span>
            <span className="text-gray-500 uppercase">{member.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}