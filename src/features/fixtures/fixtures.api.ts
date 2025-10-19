import { api } from "../../utils/api";

export type Availability = "YES" | "NO" | "MAYBE";

export type FixtureAvailabilityRow = {
  userId: number;
  email: string;
  role: "COACH" | "PLAYER";
  availability: Availability | "—";
  updatedAt: string | null;
};

export type Fixture = {
  id: number;
  opponent: string;
  squadId: number;
  kickoffAt: string;
  location?: string | null;
  notes?: string | null;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
  availability?: FixtureAvailabilityRow[];
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
      transformResponse: (rows: unknown): Fixture[] => {
        if (!Array.isArray(rows)) return [];
        return rows.map((rowRaw) => {
          const row = rowRaw as Record<string, unknown>;
          return {
            id: Number(row.id),
            opponent: String(row.opponent ?? ""),
            squadId: Number(
              (row as { squad_id?: unknown; squadId?: unknown }).squad_id ??
                (row as { squadId?: unknown }).squadId
            ),
            kickoffAt: String(
              (row as { kickoff_at?: unknown; kickoffAt?: unknown })
                .kickoff_at ??
                (row as { kickoffAt?: unknown }).kickoffAt ??
                ""
            ),
            location: (row.location ?? null) as string | null,
            notes: (row.notes ?? null) as string | null,
          };
        });
      },
    }),

    fixtureById: build.query<Fixture, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}`,
        method: "GET",
      }),
      transformResponse: (dataRaw: unknown): Fixture => {
        const data = dataRaw as Record<string, unknown>;

        const availabilityArrayRaw = Array.isArray(
          (data as { availability?: unknown }).availability
        )
          ? (data as { availability: Array<Record<string, unknown>> })
              .availability
          : [];

        const availability: FixtureAvailabilityRow[] = availabilityArrayRaw.map(
          (row) => ({
            userId: Number(
              (row as { userId?: unknown; user_id?: unknown }).userId ??
                (row as { user_id?: unknown }).user_id
            ),
            email: String((row as { email?: unknown }).email ?? ""),
            role:
              ((row as { role?: unknown }).role as "COACH" | "PLAYER") ??
              "PLAYER",
            availability:
              ((row as { availability?: unknown }).availability as
                | Availability
                | "—") ?? "—",
            updatedAt:
              (typeof (row as { updatedAt?: unknown }).updatedAt === "string"
                ? (row as { updatedAt?: string }).updatedAt
                : typeof (row as { updated_at?: unknown }).updated_at ===
                  "string"
                ? (row as { updated_at?: string }).updated_at
                : null) ?? null,
          })
        );

        return {
          id: Number(data.id),
          opponent: String(data.opponent ?? ""),
          squadId: Number(
            (data as { squadId?: unknown; squad_id?: unknown }).squadId ??
              (data as { squad_id?: unknown }).squad_id
          ),
          kickoffAt: String(
            (data as { kickoffAt?: unknown; kickoff_at?: unknown }).kickoffAt ??
              (data as { kickoff_at?: unknown }).kickoff_at ??
              ""
          ),
          location: (data.location ?? null) as string | null,
          notes: (data.notes ?? null) as string | null,
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
      transformResponse: (dataRaw: unknown): Fixture => {
        const data = dataRaw as Record<string, unknown>;
        return {
          id: Number(data.id),
          opponent: String(data.opponent ?? ""),
          squadId: Number(
            (data as { squadId?: unknown; squad_id?: unknown }).squadId ??
              (data as { squad_id?: unknown }).squad_id
          ),
          kickoffAt: String(
            (data as { kickoffAt?: unknown; kickoff_at?: unknown }).kickoffAt ??
              (data as { kickoff_at?: unknown }).kickoff_at ??
              ""
          ),
          location: (data.location ?? null) as string | null,
          notes: (data.notes ?? null) as string | null,
        };
      },
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
      transformResponse: (dataRaw: unknown): Fixture => {
        const data = dataRaw as Record<string, unknown>;
        return {
          id: Number(data.id),
          opponent: String(data.opponent ?? ""),
          squadId: Number(
            (data as { squadId?: unknown; squad_id?: unknown }).squadId ??
              (data as { squad_id?: unknown }).squad_id
          ),
          kickoffAt: String(
            (data as { kickoffAt?: unknown; kickoff_at?: unknown }).kickoffAt ??
              (data as { kickoff_at?: unknown }).kickoff_at ??
              ""
          ),
          location: (data.location ?? null) as string | null,
          notes: (data.notes ?? null) as string | null,
        };
      },
    }),

    deleteFixture: build.mutation<{ deleted: boolean; id: number }, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}`,
        method: "DELETE",
      }),
    }),

    setAvailability: build.mutation<AvailabilityRecord, SetAvailabilityBody>({
      query: ({ fixtureId, availability, userId }) => {
        const normalized = String(availability ?? "")
          .trim()
          .toUpperCase() as Availability;

        const allowed: Availability[] = ["YES", "NO", "MAYBE"];
        if (!allowed.includes(normalized)) {
          throw new Error("Availability must be YES, NO, or MAYBE");
        }

        const body: { availability: Availability; userId?: number } = {
          availability: normalized,
        };
        if (typeof userId === "number" && Number.isFinite(userId)) {
          body.userId = Number(userId);
        }

        return {
          url: `/fixtures/${fixtureId}/availability`,
          method: "POST",
          body,
        };
      },
      transformResponse: (dataRaw: unknown): AvailabilityRecord => {
        const data = dataRaw as Record<string, unknown>;
        return {
          id: Number(data.id),
          fixtureId: Number(
            (data as { fixture_id?: unknown; fixtureId?: unknown })
              .fixture_id ?? (data as { fixtureId?: unknown }).fixtureId
          ),
          userId: Number(
            (data as { user_id?: unknown; userId?: unknown }).user_id ??
              (data as { userId?: unknown }).userId
          ),
          availability: String(data.availability) as Availability,
          updatedAt: String(
            (data as { updated_at?: unknown; updatedAt?: unknown })
              .updated_at ??
              (data as { updatedAt?: unknown }).updatedAt ??
              ""
          ),
        };
      },
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
