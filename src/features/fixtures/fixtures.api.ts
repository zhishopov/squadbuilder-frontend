import { api } from "../../utils/api";

export type Availability = "YES" | "NO" | "MAYBE";

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

export type SetAvailabilityBody = {
  fixtureId: number;
  availability: Availability;
  userId?: number;
};

export type AvailabilityRecord = {
  id: number;
  fixtureId: number;
  userId: number;
  availability: Availability;
  updatedAt: string;
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

    setAvailability: build.mutation<AvailabilityRecord, SetAvailabilityBody>({
      query: ({ fixtureId, availability, userId }) => ({
        url: `/fixtures/${fixtureId}/availability`,
        method: "POST",
        body: { availability, userId },
      }),
      transformResponse: (
        data: Record<string, unknown>
      ): AvailabilityRecord => ({
        id: Number(data.id),
        fixtureId: Number(data.fixture_id ?? data.fixtureId),
        userId: Number(data.user_id ?? data.userId),
        availability: String(data.availability) as Availability,
        updatedAt: String(data.updated_at ?? data.updatedAt ?? ""),
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
  useSetAvailabilityMutation,
} = fixturesApi;
