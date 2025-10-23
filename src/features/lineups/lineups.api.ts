import { api } from "../../utils/api";

export type LineupStatus = "DRAFT" | "PUBLISHED";

export type LineupPlayerRow = {
  userId: number;
  isStarter: boolean;
  position: string | null;
  orderNumber: number;
};

export type Lineup = {
  fixtureId: number;
  status: LineupStatus;
  players: LineupPlayerRow[];
};

export type SaveLineupBody = {
  fixtureId: number;
  players: LineupPlayerRow[];
};

export type SetLineupStatusBody = {
  fixtureId: number;
  status: LineupStatus;
};

function parsePlayers(rawPlayersInput: unknown): LineupPlayerRow[] {
  if (!Array.isArray(rawPlayersInput)) return [];
  return rawPlayersInput.map((rowRaw) => {
    const row = rowRaw as Record<string, unknown>;

    const userIdValue =
      (row.userId as unknown) ?? (row.user_id as unknown) ?? 0;

    const isStarterValue =
      (row.isStarter as unknown) ?? (row.is_starter as unknown) ?? false;

    const positionValue =
      (row.position as unknown) === null || typeof row.position === "string"
        ? (row.position as string | null)
        : String(row.position);

    const orderNumberValue =
      (row.orderNumber as unknown) ?? (row.order_number as unknown) ?? 0;

    return {
      userId: Number(userIdValue),
      isStarter: Boolean(isStarterValue),
      position:
        typeof positionValue === "string" || positionValue === null
          ? positionValue
          : String(positionValue),
      orderNumber: Number(orderNumberValue),
    };
  });
}

function parseLineup(dataRaw: unknown): Lineup {
  const data = dataRaw as Record<string, unknown>;

  const players = parsePlayers(data.players);

  const fixtureIdValue =
    (data.fixtureId as unknown) ?? (data.fixture_id as unknown) ?? 0;

  const statusString = String(
    (data.status as unknown) ?? "DRAFT"
  ).toUpperCase();
  const status: LineupStatus =
    statusString === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  return {
    fixtureId: Number(fixtureIdValue),
    status,
    players,
  };
}

export const lineupsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLineup: build.query<Lineup, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}/lineup`,
        method: "GET",
      }),
      transformResponse: (dataRaw: unknown): Lineup => parseLineup(dataRaw),
    }),

    saveLineup: build.mutation<Lineup, SaveLineupBody>({
      query: (body) => ({
        url: `/fixtures/${body.fixtureId}/lineup`,
        method: "POST",
        body: {
          players: (body.players ?? []).map((playerRow) => ({
            userId: Number(playerRow.userId),
            isStarter: Boolean(playerRow.isStarter),
            position: playerRow.position ?? null,
            orderNumber: Number(playerRow.orderNumber),
          })),
        },
      }),
      transformResponse: (dataRaw: unknown): Lineup => parseLineup(dataRaw),
    }),

    setLineupStatus: build.mutation<Lineup, SetLineupStatusBody>({
      query: ({ fixtureId, status }) => ({
        url: `/fixtures/${fixtureId}/lineup/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (dataRaw: unknown): Lineup => parseLineup(dataRaw),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLineupQuery,
  useSaveLineupMutation,
  useSetLineupStatusMutation,
} = lineupsApi;
