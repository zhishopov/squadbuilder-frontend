import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  useGetSquadMembersQuery,
  useLookupUserByEmailMutation,
  useAddMemberToSquadMutation,
} from "../squads.api";

type MembersListProps = {
  squadId: number;
};

const POSITION_OPTIONS = [
  "UNASSIGNED",
  "GK",
  "RB",
  "CB",
  "LB",
  "RWB",
  "LWB",
  "CDM",
  "CM",
  "CAM",
  "RW",
  "LW",
  "ST",
  "CF",
] as const;

export default function MembersList({ squadId }: MembersListProps) {
  const currentUserRole =
    useSelector((state: RootState) => state.auth.user?.role) ?? null;

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
  const [preferredPositionInput, setPreferredPositionInput] =
    useState<string>("UNASSIGNED");
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
        preferredPosition: preferredPositionInput,
      }).unwrap();

      setFeedbackMessage(`Added ${foundUser.email} to the squad.`);
      setMemberEmailInput("");
      setPreferredPositionInput("UNASSIGNED");
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

      {currentUserRole === "COACH" && (
        <form
          onSubmit={handleAddMember}
          className="mb-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2"
        >
          <input
            type="email"
            placeholder="player@email.com"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={memberEmailInput}
            onChange={(e) => setMemberEmailInput(e.target.value)}
            required
            autoComplete="email"
          />

          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={preferredPositionInput}
            onChange={(e) => setPreferredPositionInput(e.target.value)}
          >
            {POSITION_OPTIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

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
      )}

      {feedbackMessage && (
        <p className="mb-3 text-sm text-gray-700">{feedbackMessage}</p>
      )}

      {isMembersLoading ? (
        <p className="text-sm text-gray-600">Loading members…</p>
      ) : hasMembersError ? (
        <p className="text-sm text-red-600">
          Failed to load members (status
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
              <div className="text-xs text-gray-600">
                {member.preferredPosition ?? "UNASSIGNED"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
