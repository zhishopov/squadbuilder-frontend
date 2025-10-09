import { useState } from "react";
import {
  useGetSquadMembersQuery,
  useLookupUserByEmailMutation,
  useAddMemberToSquadMutation,
} from "../squads.api";

type MembersListProps = {
  squadId: number;
};

export default function MembersList({ squadId }: MembersListProps) {
  const {
    data: squadMembers,
    isLoading: isMembersLoading,
    isError: hasMembersError,
    error: membersError,
    refetch: refetchMembers,
  } = useGetSquadMembersQuery(squadId, { skip: !squadId });

  const [lookupUserByEmail, { isLoading: isLookupLoading }] =
    useLookupUserByEmailMutation();
  const [addMemberToSquad, { isLoading: isAddMemberLoading }] =
    useAddMemberToSquadMutation();

  const [memberEmailInput, setMemberEmailInput] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  async function handleAddMember(event: React.FormEvent) {
    event.preventDefault();
    setFeedbackMessage(null);

    if (!memberEmailInput.trim() || !squadId) return;

    try {
      const foundUser = await lookupUserByEmail({
        email: memberEmailInput,
      }).unwrap();

      if (foundUser.role !== "PLAYER") {
        setFeedbackMessage("User must be a PLAYER to join a squad.");
        return;
      }

      await addMemberToSquad({
        squadId,
        userId: foundUser.id,
      }).unwrap();

      setFeedbackMessage(`Added ${foundUser.email} to the squad.`);
      setMemberEmailInput("");
      refetchMembers();
    } catch (error) {
      const status = (error as { status?: number })?.status;
      if (status === 409) {
        setFeedbackMessage("That user is already a member of the squad.");
      } else if (status === 404) {
        setFeedbackMessage("No user found with that email.");
      } else {
        setFeedbackMessage("Could not add member. Please try again.");
      }
    }
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Members</h2>

      <form onSubmit={handleAddMember} className="mb-4 flex gap-2">
        <input
          type="email"
          placeholder="player@email.com"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={memberEmailInput}
          onChange={(e) => setMemberEmailInput(e.target.value)}
          required
          autoComplete="email"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          disabled={
            isLookupLoading || isAddMemberLoading || !memberEmailInput.trim()
          }
        >
          {isLookupLoading || isAddMemberLoading ? "Adding…" : "Add member"}
        </button>
      </form>

      {feedbackMessage && (
        <p className="mb-3 text-sm text-gray-700">{feedbackMessage}</p>
      )}

      {isMembersLoading ? (
        <p className="text-sm text-gray-600">Loading members…</p>
      ) : hasMembersError ? (
        <p className="text-sm text-red-600">
          Failed to load members (status{" "}
          {(membersError as { status?: number })?.status ?? "?"})
        </p>
      ) : !squadMembers || squadMembers.length === 0 ? (
        <p className="text-sm text-gray-700">No members yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {squadMembers.map((member) => (
            <li
              key={member.id}
              className="py-2 text-sm flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{member.email}</p>
                <p className="text-gray-500">
                  Role: <span className="uppercase">{member.role}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
