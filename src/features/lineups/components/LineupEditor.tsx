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
  "LB",
  "CB",
  "RB",
  "LM",
  "CM",
  "RM",
  "LW",
  "RW",
  "CAM",
  "CDM",
  "ST",
  "SUB",
];

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

  const [saveLineup, { isLoading: isSaving }] = useSaveLineupMutation();
  const [setLineupStatus, { isLoading: isToggling }] =
    useSetLineupStatusMutation();

  const initialRows = useMemo<EditableRow[]>(() => {
    const fixturePlayers =
      fixture?.availability?.filter((player) => player.role === "PLAYER") ?? [];
    const existingPlayers = lineup?.players ?? [];
    const existingMap = new Map<number, LineupPlayerRow>();
    for (const player of existingPlayers) {
      existingMap.set(player.userId, player);
    }
    return fixturePlayers.map((fixturePlayer) => {
      const existing = existingMap.get(fixturePlayer.userId);
      return {
        userId: fixturePlayer.userId,
        email: fixturePlayer.email,
        isStarter: existing?.isStarter ?? false,
        position: existing?.position ?? null,
        orderNumber:
          typeof existing?.orderNumber === "number" ? existing.orderNumber : 0,
      };
    });
  }, [fixture?.availability, lineup?.players]);

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

  function handleToggleStarter(userId: number) {
    setRows((previousRows) =>
      previousRows.map((editableRow) =>
        editableRow.userId === userId
          ? { ...editableRow, isStarter: !editableRow.isStarter }
          : editableRow
      )
    );
  }

  function handlePositionChange(userId: number, newValue: string) {
    const normalizedPosition = newValue === "" ? null : newValue;
    setRows((previousRows) =>
      previousRows.map((editableRow) =>
        editableRow.userId === userId
          ? { ...editableRow, position: normalizedPosition }
          : editableRow
      )
    );
  }

  function handleOrderChange(userId: number, newValue: string) {
    const parsed = Number(newValue);
    const safeValue = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    setRows((previousRows) =>
      previousRows.map((editableRow) =>
        editableRow.userId === userId
          ? { ...editableRow, orderNumber: safeValue }
          : editableRow
      )
    );
  }

  async function handleSaveDraft() {
    const selectedRows = rows
      .filter(
        (editableRow) =>
          editableRow.isStarter ||
          (typeof editableRow.position === "string" &&
            editableRow.position.length > 0) ||
          editableRow.orderNumber > 0
      )
      .slice(0, 18);

    if (
      selectedRows.filter((editableRow) => editableRow.isStarter).length > 11
    ) {
      toast.error("You can select at most 11 starters");
      return;
    }

    const payloadPlayers: LineupPlayerRow[] = selectedRows.map(
      (editableRow) => ({
        userId: editableRow.userId,
        isStarter: editableRow.isStarter,
        position: editableRow.position,
        orderNumber: editableRow.orderNumber,
      })
    );

    try {
      await saveLineup({ fixtureId, players: payloadPlayers }).unwrap();
      toast.success("Lineup saved");
      await Promise.all([refetchLineup(), refetchFixture()]);
    } catch (saveError) {
      toast.error("Failed to save lineup");
      console.error(saveError);
    }
  }

  async function handleTogglePublish() {
    const nextStatus: LineupStatus =
      status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    if (nextStatus === "PUBLISHED") {
      const currentSelected = rows.filter(
        (editableRow) =>
          editableRow.isStarter ||
          (typeof editableRow.position === "string" &&
            editableRow.position.length > 0) ||
          editableRow.orderNumber > 0
      );
      if (
        currentSelected.filter((editableRow) => editableRow.isStarter).length >
        11
      ) {
        toast.error("You can select at most 11 starters");
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
    } catch (toggleError) {
      toast.error("Failed to update lineup status");
      console.error(toggleError);
    }
  }

  if (isFixtureLoading || isLineupLoading) {
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
    return (
      <div className="text-sm text-red-600">
        Failed to load lineup (
        {(lineupError as { status?: number })?.status ?? "?"})
      </div>
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

      <div className="rounded-lg border divide-y">
        <div className="grid grid-cols-5 gap-2 p-3 text-xs font-semibold text-gray-600">
          <div>Player</div>
          <div>Starter</div>
          <div>Position</div>
          <div>Order</div>
          <div></div>
        </div>

        {(rows ?? []).map((editableRow) => (
          <div
            key={editableRow.userId}
            className="grid grid-cols-5 gap-2 p-3 items-center"
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

            <div className="text-right">
              <Link
                to={`/fixtures/${fixtureId}`}
                className="text-emerald-700 underline text-xs"
              >
                View Fixture
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        Starters: {startersCount} / 11
      </div>
    </div>
  );
}
