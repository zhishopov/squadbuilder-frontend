import { api } from "../../utils/api";

export type Availability = "YES" | "NO" | "MAYBE";

export type AvailabilityEntry = {
  userId: number;
  email: string;
  role: "COACH" | "PLAYER";
  availability: Availability;
  updatedAt: string;
};

export type Fixture = {
  id: number;
  opponent: string;
  squadId: number;
  kickoffAt: string;
  location?: string | null;
  notes?: string | null;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
  availability?: AvailabilityEntry[];
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
      transformResponse: (data: Record<string, unknown>): Fixture => {
        const availabilityRaw = Array.isArray(
          (data as Record<string, unknown>).availability
        )
          ? ((data as Record<string, unknown>).availability as Array<
              Record<string, unknown>
            >)
          : [];

        const availability: AvailabilityEntry[] = availabilityRaw.map(
          (row) => ({
            userId: Number(row.userId ?? row.user_id),
            email: String(row.email ?? ""),
            role: (row.role === "COACH" || row.role === "PLAYER"
              ? row.role
              : "PLAYER") as "COACH" | "PLAYER",
            availability: (["YES", "NO", "MAYBE"].includes(
              String(row.availability)
            )
              ? String(row.availability)
              : "MAYBE") as Availability,
            updatedAt: new Date(
              String(
                row.updatedAt ?? row.updated_at ?? new Date().toISOString()
              )
            ).toISOString(),
          })
        );

        return {
          id: Number(data.id),
          opponent: String(data.opponent ?? ""),
          squadId: Number(
            (data as Record<string, unknown>).squadId ??
              (data as Record<string, unknown>).squad_id
          ),
          kickoffAt: String(
            (data as Record<string, unknown>).kickoffAt ??
              (data as Record<string, unknown>).kickoff_at ??
              ""
          ),
          location: ((data as Record<string, unknown>).location ?? null) as
            | string
            | null,
          notes: ((data as Record<string, unknown>).notes ?? null) as
            | string
            | null,
          availability,
        };
      },
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
        squadId: Number(
          (data as Record<string, unknown>).squadId ??
            (data as Record<string, unknown>).squad_id
        ),
        kickoffAt: String(
          (data as Record<string, unknown>).kickoffAt ??
            (data as Record<string, unknown>).kickoff_at ??
            ""
        ),
        location: ((data as Record<string, unknown>).location ?? null) as
          | string
          | null,
        notes: ((data as Record<string, unknown>).notes ?? null) as
          | string
          | null,
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
        squadId: Number(
          (data as Record<string, unknown>).squadId ??
            (data as Record<string, unknown>).squad_id
        ),
        kickoffAt: String(
          (data as Record<string, unknown>).kickoffAt ??
            (data as Record<string, unknown>).kickoff_at ??
            ""
        ),
        location: ((data as Record<string, unknown>).location ?? null) as
          | string
          | null,
        notes: ((data as Record<string, unknown>).notes ?? null) as
          | string
          | null,
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
        fixtureId: Number(
          (data as Record<string, unknown>).fixture_id ??
            (data as Record<string, unknown>).fixtureId
        ),
        userId: Number(
          (data as Record<string, unknown>).user_id ??
            (data as Record<string, unknown>).userId
        ),
        availability: String(data.availability) as Availability,
        updatedAt: String(
          (data as Record<string, unknown>).updated_at ??
            (data as Record<string, unknown>).updatedAt ??
            ""
        ),
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
