import { useMySquadQuery, useSquadMembersQuery } from "../dashboard.api";

export default function MembersCard() {
  const { data: squad, isLoading: squadLoading } = useMySquadQuery();

  const {
    data: members,
    isLoading: membersLoading,
    isError,
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
    return (
      <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Squad Members</h2>
        <p className="text-sm text-red-600">Failed to load squad members.</p>
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
          <li key={member.id} className="py-2 flex justify-between text-sm">
            <span>{member.email}</span>
            <span className="text-gray-500">{member.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
