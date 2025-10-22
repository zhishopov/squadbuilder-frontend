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

export const lineupsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLineup: build.query<Lineup, number>({
      query: (fixtureId) => ({
        url: `/lineup/${fixtureId}`,
        method: "GET",
      }),
      transformResponse: (dataRaw: unknown): Lineup => {
        const data = dataRaw as Record<string, unknown>;

        const rawPlayers = Array.isArray(
          (data as { players?: unknown }).players
        )
          ? ((data as { players: Array<Record<string, unknown>> })
              .players as Array<Record<string, unknown>>)
          : [];

        const players: LineupPlayerRow[] = rawPlayers.map((row) => {
          const userId =
            (row as { userId?: unknown; user_id?: unknown }).userId ??
            (row as { user_id?: unknown }).user_id ??
            0;

          const isStarterRaw =
            (row as { isStarter?: unknown; is_starter?: unknown }).isStarter ??
            (row as { is_starter?: unknown }).is_starter ??
            false;

          const positionValue =
            (row as { position?: unknown }).position ?? null;

          const orderNumberRaw =
            (row as { orderNumber?: unknown; order_number?: unknown })
              .orderNumber ??
            (row as { order_number?: unknown }).order_number ??
            0;

          return {
            userId: Number(userId),
            isStarter: Boolean(isStarterRaw),
            position:
              typeof positionValue === "string" || positionValue === null
                ? (positionValue as string | null)
                : String(positionValue),
            orderNumber: Number(orderNumberRaw),
          };
        });

        const fixtureIdRaw =
          (data as { fixtureId?: unknown; fixture_id?: unknown }).fixtureId ??
          (data as { fixture_id?: unknown }).fixture_id ??
          0;

        const statusRaw = String(
          (data as { status?: unknown }).status ?? "DRAFT"
        ).toUpperCase();

        const status: LineupStatus =
          statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

        return {
          fixtureId: Number(fixtureIdRaw),
          status,
          players,
        };
      },
    }),

    saveLineup: build.mutation<Lineup, SaveLineupBody>({
      query: (body) => ({
        url: "/lineup",
        method: "POST",
        body: {
          fixtureId: Number(body.fixtureId),
          players: (body.players ?? []).map((p) => ({
            userId: Number(p.userId),
            isStarter: Boolean(p.isStarter),
            position: p.position ?? null,
            orderNumber: Number(p.orderNumber),
          })),
        },
      }),
      transformResponse: (dataRaw: unknown): Lineup => {
        const data = dataRaw as Record<string, unknown>;

        const rawPlayers = Array.isArray(
          (data as { players?: unknown }).players
        )
          ? ((data as { players: Array<Record<string, unknown>> })
              .players as Array<Record<string, unknown>>)
          : [];

        const players: LineupPlayerRow[] = rawPlayers.map((row) => {
          const userId =
            (row as { userId?: unknown; user_id?: unknown }).userId ??
            (row as { user_id?: unknown }).user_id ??
            0;

          const isStarterRaw =
            (row as { isStarter?: unknown; is_starter?: unknown }).isStarter ??
            (row as { is_starter?: unknown }).is_starter ??
            false;

          const positionValue =
            (row as { position?: unknown }).position ?? null;

          const orderNumberRaw =
            (row as { orderNumber?: unknown; order_number?: unknown })
              .orderNumber ??
            (row as { order_number?: unknown }).order_number ??
            0;

          return {
            userId: Number(userId),
            isStarter: Boolean(isStarterRaw),
            position:
              typeof positionValue === "string" || positionValue === null
                ? (positionValue as string | null)
                : String(positionValue),
            orderNumber: Number(orderNumberRaw),
          };
        });

        const fixtureIdRaw =
          (data as { fixtureId?: unknown; fixture_id?: unknown }).fixtureId ??
          (data as { fixture_id?: unknown }).fixture_id ??
          0;

        const statusRaw = String(
          (data as { status?: unknown }).status ?? "DRAFT"
        ).toUpperCase();

        const status: LineupStatus =
          statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

        return {
          fixtureId: Number(fixtureIdRaw),
          status,
          players,
        };
      },
    }),

    setLineupStatus: build.mutation<Lineup, SetLineupStatusBody>({
      query: ({ fixtureId, status }) => ({
        url: `/lineup/${fixtureId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (dataRaw: unknown): Lineup => {
        const data = dataRaw as Record<string, unknown>;

        const rawPlayers = Array.isArray(
          (data as { players?: unknown }).players
        )
          ? ((data as { players: Array<Record<string, unknown>> })
              .players as Array<Record<string, unknown>>)
          : [];

        const players: LineupPlayerRow[] = rawPlayers.map((row) => {
          const userId =
            (row as { userId?: unknown; user_id?: unknown }).userId ??
            (row as { user_id?: unknown }).user_id ??
            0;

          const isStarterRaw =
            (row as { isStarter?: unknown; is_starter?: unknown }).isStarter ??
            (row as { is_starter?: unknown }).is_starter ??
            false;

          const positionValue =
            (row as { position?: unknown }).position ?? null;

          const orderNumberRaw =
            (row as { orderNumber?: unknown; order_number?: unknown })
              .orderNumber ??
            (row as { order_number?: unknown }).order_number ??
            0;

          return {
            userId: Number(userId),
            isStarter: Boolean(isStarterRaw),
            position:
              typeof positionValue === "string" || positionValue === null
                ? (positionValue as string | null)
                : String(positionValue),
            orderNumber: Number(orderNumberRaw),
          };
        });

        const fixtureIdRaw =
          (data as { fixtureId?: unknown; fixture_id?: unknown }).fixtureId ??
          (data as { fixture_id?: unknown }).fixture_id ??
          0;

        const statusRaw = String(
          (data as { status?: unknown }).status ?? "DRAFT"
        ).toUpperCase();

        const status: LineupStatus =
          statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

        return {
          fixtureId: Number(fixtureIdRaw),
          status,
          players,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLineupQuery,
  useSaveLineupMutation,
  useSetLineupStatusMutation,
} = lineupsApi;
