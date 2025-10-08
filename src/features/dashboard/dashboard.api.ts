import { api } from "../../utils/api";
import { skipToken } from "@reduxjs/toolkit/query";

export type Squad = {
  id: number;
  name: string;
  coachId: number;
  membersCount?: number;
};

export type Member = {
  id: number;
  email: string;
  role: "COACH" | "PLAYER";
};

export type Fixture = {
  id: number;
  date: string;
  opponent: string;
  squadId: number;
  location?: string;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
};

export type Lineup = {
  id: number;
  fixtureId: number;
  published: boolean;
  selectedPlayerIds: number[];
};

export type SetAvailabilityBody = {
  fixtureId: number;
  status: "YES" | "NO" | "MAYBE";
};

export const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    mySquad: build.query<Squad | null, void>({
      query: () => ({ url: "/me/squad", method: "GET" }),
    }),

    squadMembers: build.query<Member[], number>({
      query: (squadId) => ({
        url: `/squads/${squadId}/members`,
        method: "GET",
      }),
    }),

    fixturesForSquad: build.query<Fixture[], number>({
      query: (squadId) => ({
        url: `/squads/${squadId}/fixtures`,
        method: "GET",
      }),
    }),

    lineupByFixture: build.query<Lineup, number>({
      query: (fixtureId) => ({
        url: `/fixtures/${fixtureId}/lineup`,
        method: "GET",
      }),
    }),

    setAvailability: build.mutation<void, SetAvailabilityBody>({
      query: ({ fixtureId, status }) => ({
        url: `/fixtures/${fixtureId}/availability`,
        method: "POST",
        body: { status },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useMySquadQuery,
  useSquadMembersQuery,
  useFixturesForSquadQuery,
  useLineupByFixtureQuery,
  useSetAvailabilityMutation,
} = dashboardApi;

export { skipToken };
