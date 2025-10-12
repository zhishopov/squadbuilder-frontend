import { api } from "../../utils/api";

export type Fixture = {
  id: number;
  opponent: string;
  squadId: number;
  kickoffAt: string;
  location?: string | null;
  notes?: string | null;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
};

export type CreateFixtureBody = {
  squadId: number;
  opponent: string;
  kickoffAt: string;
  location?: string | null;
  notes?: string | null;
};

export type UpdateFixtureBody = {
  opponent?: string;
  kickoffAt?: string;
  location?: string | null;
  notes?: string | null;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
};

export const fixturesApi = api.injectEndpoints({
  endpoints: (build) => ({
    fixturesBySquad: build.query<Fixture[], number>({
      query: (squadId) => ({
        url: `/squads/${squadId}/fixtures`,
        method: "GET",
      }),
      transformResponse: (rows: Array<Record<string, unknown>>): Fixture[] =>
        rows.map((row) => ({
          id: Number(row.id),
          opponent: String(row.opponent ?? ""),
          squadId: Number(row.squad_id),
          kickoffAt: String(row.kickoff_at),
          location: (row.location ?? null) as string | null,
          notes: (row.notes ?? null) as string | null,
        })),
    }),

    fixtureById: build.query<Fixture, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}`,
        method: "GET",
      }),
      transformResponse: (data: Record<string, unknown>): Fixture => ({
        id: Number(data.id),
        opponent: String(data.opponent ?? ""),
        squadId: Number(data.squadId ?? data.squad_id),
        kickoffAt: String(data.kickoffAt ?? data.kickoff_at ?? ""),
        location: (data.location ?? null) as string | null,
        notes: (data.notes ?? null) as string | null,
      }),
    }),

    createFixture: build.mutation<Fixture, CreateFixtureBody>({
      query: (body) => ({
        url: "/fixtures",
        method: "POST",
        body,
      }),
      transformResponse: (data: Record<string, unknown>): Fixture => ({
        id: Number(data.id),
        opponent: String(data.opponent ?? ""),
        squadId: Number(data.squadId ?? data.squad_id),
        kickoffAt: String(data.kickoffAt ?? data.kickoff_at ?? ""),
        location: (data.location ?? null) as string | null,
        notes: (data.notes ?? null) as string | null,
      }),
    }),

    updateFixture: build.mutation<
      Fixture,
      { fixtureId: number; body: UpdateFixtureBody }
    >({
      query: ({ fixtureId, body }) => ({
        url: `/fixtures/${fixtureId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (data: Record<string, unknown>): Fixture => ({
        id: Number(data.id),
        opponent: String(data.opponent ?? ""),
        squadId: Number(data.squadId ?? data.squad_id),
        kickoffAt: String(data.kickoffAt ?? data.kickoff_at ?? ""),
        location: (data.location ?? null) as string | null,
        notes: (data.notes ?? null) as string | null,
      }),
    }),

    deleteFixture: build.mutation<{ deleted: boolean; id: number }, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useFixturesBySquadQuery,
  useFixtureByIdQuery,
  useCreateFixtureMutation,
  useUpdateFixtureMutation,
  useDeleteFixtureMutation,
} = fixturesApi;
