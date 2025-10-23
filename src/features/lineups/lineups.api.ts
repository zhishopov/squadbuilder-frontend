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
  formation?: string | null;
};

export type SaveLineupBody = {
  fixtureId: number;
  players: LineupPlayerRow[];
  formation?: string | null;
};

export type SetLineupStatusBody = {
  fixtureId: number;
  status: LineupStatus;
};

type BackendPlayer = {
  userId: number;
  email?: string;
  position: string;
  order: number;
  starter: boolean;
};

type BackendGetOrSaveResponse = {
  fixtureId: number;
  lineupId: number | null;
  status: string | null;
  formation: string | null;
  players: BackendPlayer[];
};

function toFrontendLineup(data: BackendGetOrSaveResponse): Lineup {
  const statusRaw = String(data.status ?? "DRAFT").toUpperCase();
  const status: LineupStatus =
    statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  const players: LineupPlayerRow[] = Array.isArray(data.players)
    ? data.players.map((p) => ({
        userId: Number(p.userId),
        isStarter: Boolean(p.starter),
        position:
          typeof p.position === "string" && p.position.length > 0
            ? p.position
            : null,
        orderNumber: Number(p.order),
      }))
    : [];

  return {
    fixtureId: Number(data.fixtureId),
    status,
    players,
    formation: data.formation ?? null,
  };
}

export const lineupsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLineup: build.query<Lineup, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}/lineup`,
        method: "GET",
      }),
      transformResponse: (data: BackendGetOrSaveResponse): Lineup =>
        toFrontendLineup(data),
    }),

    saveLineup: build.mutation<Lineup, SaveLineupBody>({
      query: ({ fixtureId, players, formation }) => ({
        url: `/fixtures/${fixtureId}/lineup`,
        method: "POST",
        body: {
          ...(typeof formation === "string" && formation.trim().length > 0
            ? { formation: formation.trim() }
            : {}),
          players: (players ?? []).map((player) => ({
            userId: Number(player.userId),
            position:
              typeof player.position === "string" && player.position.length > 0
                ? player.position
                : "UNASSIGNED",
            order: Number(player.orderNumber),
            starter: Boolean(player.isStarter),
          })),
        },
      }),
      transformResponse: (data: BackendGetOrSaveResponse): Lineup =>
        toFrontendLineup(data),
    }),

    setLineupStatus: build.mutation<Lineup, SetLineupStatusBody>({
      query: ({ fixtureId, status }) => ({
        url: `/fixtures/${fixtureId}/lineup/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (data: BackendGetOrSaveResponse): Lineup =>
        toFrontendLineup(data),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLineupQuery,
  useSaveLineupMutation,
  useSetLineupStatusMutation,
} = lineupsApi;
