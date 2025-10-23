import { useEffect, useMemo, useState } from "react";
import { useFixtureByIdQuery } from "../../fixtures/fixtures.api";
import {
  useGetLineupQuery,
  useSaveLineupMutation,
  useSetLineupStatusMutation,
  type Lineup,
  type LineupPlayerRow,
  type LineupStatus,
} from "../lineups.api";
import { useGetSquadMembersQuery } from "../../squads/squads.api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type LineupEditorProps = {
  fixtureId: number;
  initialLineup?: Lineup;
};

type EditableRow = {
  userId: number;
  email: string;
  isStarter: boolean;
  position: string | null;
  orderNumber: number;
};

const POSITIONS = [
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
  "UNASSIGNED",
] as const;

export default function LineupEditor({ fixtureId }: LineupEditorProps) {
  const {
    data: fixture,
    isLoading: isFixtureLoading,
    isError: isFixtureError,
    error: fixtureError,
    refetch: refetchFixture,
  } = useFixtureByIdQuery(fixtureId);

  const {
    data: lineup,
    isLoading: isLineupLoading,
    isError: isLineupError,
    error: lineupError,
    refetch: refetchLineup,
  } = useGetLineupQuery(fixtureId);

  const squadId = Number(fixture?.squadId ?? 0);
  const {
    data: squadMembers,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useGetSquadMembersQuery(squadId, { skip: !squadId });

  const [saveLineup, { isLoading: isSaving }] = useSaveLineupMutation();
  const [setLineupStatus, { isLoading: isToggling }] =
    useSetLineupStatusMutation();

  const initialRows = useMemo<EditableRow[]>(() => {
    const basePlayers =
      squadMembers?.filter((member) => member.role === "PLAYER") ??
      fixture?.availability?.filter((player) => player.role === "PLAYER") ??
      [];

    const existingPlayers = lineup?.players ?? [];
    const existingByUserId = new Map<number, LineupPlayerRow>();
    for (const existingPlayer of existingPlayers) {
      existingByUserId.set(existingPlayer.userId, existingPlayer);
    }

    return basePlayers.map((basePlayer) => {
      const existing = existingByUserId.get(basePlayer.userId);
      return {
        userId: basePlayer.userId,
        email: "email" in basePlayer ? String(basePlayer.email) : "",
        isStarter: existing?.isStarter ?? false,
        position: existing?.position ?? null,
        orderNumber:
          typeof existing?.orderNumber === "number" ? existing.orderNumber : 0,
      };
    });
  }, [squadMembers, fixture?.availability, lineup?.players]);

  const [rows, setRows] = useState<EditableRow[]>([]);
  const [status, setStatus] = useState<LineupStatus>("DRAFT");

  useEffect(() => {
    if (
      initialRows.length > 0 ||
      (lineup && (lineup.players ?? []).length === 0)
    ) {
      setRows(initialRows);
    }
    if (lineup?.status) {
      setStatus(lineup.status);
    }
  }, [initialRows, lineup]);

  const startersCount = useMemo(
    () => rows.filter((row) => row.isStarter).length,
    [rows]
  );

  const currentUserIds = useMemo(
    () => new Set(rows.map((row) => row.userId)),
    [rows]
  );

  const addableMembers = useMemo(() => {
    const sourceMembers =
      squadMembers?.filter((member) => member.role === "PLAYER") ?? [];
    return sourceMembers.filter((member) => !currentUserIds.has(member.userId));
  }, [squadMembers, currentUserIds]);

  const [selectedNewUserId, setSelectedNewUserId] = useState<number | "">("");

  function getNextOrderNumber(): number {
    const usedOrderNumbers = new Set(
      rows.map((row) => row.orderNumber).filter((order) => order > 0)
    );
    for (let candidate = 1; candidate <= 20; candidate++) {
      if (!usedOrderNumbers.has(candidate)) return candidate;
    }
    return 0;
  }

  function handleAddSelectedPlayer() {
    if (selectedNewUserId === "") return;
    const member = addableMembers.find(
      (candidate) => candidate.userId === selectedNewUserId
    );
    if (!member) return;

    const nextOrder = getNextOrderNumber();
    const newRow: EditableRow = {
      userId: member.userId,
      email: member.email,
      isStarter: false,
      position: null,
      orderNumber: nextOrder,
    };
    setRows((previousRows) => [...previousRows, newRow]);
    setSelectedNewUserId("");
  }

  function handleRemovePlayer(userId: number) {
    setRows((previousRows) =>
      previousRows.filter((row) => row.userId !== userId)
    );
  }

  function handleToggleStarter(userId: number) {
    setRows((previousRows) =>
      previousRows.map((row) =>
        row.userId === userId ? { ...row, isStarter: !row.isStarter } : row
      )
    );
  }

  function handlePositionChange(userId: number, newValue: string) {
    const normalizedPosition = newValue === "" ? null : newValue;
    setRows((previousRows) =>
      previousRows.map((row) =>
        row.userId === userId ? { ...row, position: normalizedPosition } : row
      )
    );
  }

  function handleOrderChange(userId: number, newValue: string) {
    const parsed = Number(newValue);
    const safeValue =
      Number.isFinite(parsed) && parsed >= 0 && parsed <= 20 ? parsed : 0;
    setRows((previousRows) =>
      previousRows.map((row) =>
        row.userId === userId ? { ...row, orderNumber: safeValue } : row
      )
    );
  }

  function validateBeforeSave(selectedRows: EditableRow[]): string | null {
    if (selectedRows.length > 20) {
      return "You can include at most 20 players";
    }
    const starters = selectedRows.filter((row) => row.isStarter).length;
    if (starters > 11) {
      return "You can select at most 11 starters";
    }
    const seenUserIds = new Set<number>();
    for (const row of selectedRows) {
      if (seenUserIds.has(row.userId)) {
        return "Duplicate player in lineup";
      }
      seenUserIds.add(row.userId);
    }
    const nonZeroOrders = selectedRows
      .map((row) => row.orderNumber)
      .filter((order) => order > 0);
    const uniqueOrders = new Set(nonZeroOrders);
    if (uniqueOrders.size !== nonZeroOrders.length) {
      return "Duplicate order numbers";
    }
    for (const order of nonZeroOrders) {
      if (order < 1 || order > 20) {
        return "Order must be between 1 and 20";
      }
    }
    return null;
  }

  async function handleSaveDraft() {
    const selectedRows = rows
      .filter(
        (row) =>
          row.isStarter ||
          (typeof row.position === "string" && row.position.length > 0) ||
          row.orderNumber > 0
      )
      .slice(0, 20);

    const validationError = validateBeforeSave(selectedRows);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payloadPlayers: LineupPlayerRow[] = selectedRows.map((row) => ({
      userId: row.userId,
      isStarter: row.isStarter,
      position: row.position,
      orderNumber: row.orderNumber,
    }));

    try {
      await saveLineup({ fixtureId, players: payloadPlayers }).unwrap();
      toast.success("Lineup saved");
      await Promise.all([refetchLineup(), refetchFixture()]);
    } catch (error) {
      const message =
        (error as { data?: { error?: string } })?.data?.error ??
        (error as { error?: string })?.error ??
        "Failed to save lineup";
      toast.error(message);
      console.error("saveLineup error", error);
    }
  }

  async function handleTogglePublish() {
    const nextStatus: LineupStatus =
      status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    if (nextStatus === "PUBLISHED") {
      const currentSelected = rows.filter(
        (row) =>
          row.isStarter ||
          (typeof row.position === "string" && row.position.length > 0) ||
          row.orderNumber > 0
      );
      const validationError = validateBeforeSave(currentSelected);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }

    try {
      const result = await setLineupStatus({
        fixtureId,
        status: nextStatus,
      }).unwrap();
      setStatus(result.status);
      toast.success(
        nextStatus === "PUBLISHED" ? "Lineup published" : "Lineup set to draft"
      );
      await Promise.all([refetchLineup(), refetchFixture()]);
    } catch (error) {
      const message =
        (error as { data?: { error?: string } })?.data?.error ??
        (error as { error?: string })?.error ??
        "Failed to update lineup status";
      toast.error(message);
      console.error("setLineupStatus error", error);
    }
  }

  if (isFixtureLoading || isLineupLoading || (squadId && isMembersLoading)) {
    return <div className="text-sm text-gray-600">Loading lineup…</div>;
  }

  if (isFixtureError) {
    return (
      <div className="text-sm text-red-600">
        Failed to load fixture (
        {(fixtureError as { status?: number })?.status ?? "?"})
      </div>
    );
  }

  if (isLineupError) {
    const httpStatus = (lineupError as { status?: number })?.status;
    if (httpStatus && httpStatus !== 404) {
      return (
        <div className="text-sm text-red-600">
          Failed to load lineup ({httpStatus})
        </div>
      );
    }
  }

  if (isMembersError && squadId) {
    return (
      <div className="text-sm text-red-600">Failed to load squad members</div>
    );
  }

  if (!fixture) {
    return <div className="text-sm text-gray-700">Fixture not found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Status:</span>{" "}
          <span
            className={
              status === "PUBLISHED"
                ? "text-emerald-700 font-semibold"
                : "text-gray-700"
            }
          >
            {status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isToggling}
            className="rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={handleTogglePublish}
            disabled={isSaving || isToggling}
            className="rounded-md bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {isToggling
              ? "Updating…"
              : status === "PUBLISHED"
              ? "Unpublish"
              : "Publish"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <div className="flex gap-2 items-center">
          <select
            value={selectedNewUserId === "" ? "" : String(selectedNewUserId)}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setSelectedNewUserId(value === "" ? "" : Number(value));
            }}
            className="border rounded px-2 py-1 text-sm min-w-[220px]"
          >
            <option value="">Add player…</option>
            {addableMembers.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.email}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddSelectedPlayer}
            disabled={selectedNewUserId === "" || rows.length >= 20}
            className="rounded-md bg-gray-800 px-3 py-1.5 text-white text-sm disabled:opacity-60"
          >
            Add
          </button>
          <Link
            to={`/fixtures/${fixtureId}`}
            className="ml-auto text-emerald-700 underline text-xs"
          >
            View Fixture
          </Link>
        </div>

        <div className="rounded-lg border divide-y">
          <div className="grid grid-cols-6 gap-2 p-3 text-xs font-semibold text-gray-600">
            <div>Player</div>
            <div>Starter</div>
            <div>Position</div>
            <div>Order</div>
            <div></div>
            <div></div>
          </div>

          {(rows ?? []).map((editableRow) => (
            <div
              key={editableRow.userId}
              className="grid grid-cols-6 gap-2 p-3 items-center"
            >
              <div className="text-sm">
                <div className="font-medium">{editableRow.email}</div>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editableRow.isStarter}
                    onChange={() => handleToggleStarter(editableRow.userId)}
                  />
                  <span>Starter</span>
                </label>
              </div>

              <div>
                <select
                  value={editableRow.position ?? ""}
                  onChange={(event) =>
                    handlePositionChange(
                      editableRow.userId,
                      event.currentTarget.value
                    )
                  }
                  className="border rounded px-2 py-1 text-sm w-full"
                >
                  <option value="">—</option>
                  {POSITIONS.map((positionOption) => (
                    <option key={positionOption} value={positionOption}>
                      {positionOption}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={editableRow.orderNumber}
                  onChange={(event) =>
                    handleOrderChange(
                      editableRow.userId,
                      event.currentTarget.value
                    )
                  }
                  className="border rounded px-2 py-1 text-sm w-20"
                />
              </div>

              <div className="text-xs text-gray-500">
                {editableRow.orderNumber > 0 ? "In order" : "—"}
              </div>

              <div className="text-right">
                <button
                  onClick={() => handleRemovePlayer(editableRow.userId)}
                  className="text-red-600 text-xs underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500">
          Starters: {startersCount} / 11
        </div>
      </div>
    </div>
  );
}
