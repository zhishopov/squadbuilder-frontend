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
    }),

    fixtureById: build.query<Fixture, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}`,
        method: "GET",
      }),
    }),

    createFixture: build.mutation<Fixture, CreateFixtureBody>({
      query: (body) => ({
        url: "/fixtures",
        method: "POST",
        body,
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
