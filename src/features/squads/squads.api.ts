import { api } from "../../utils/api";

export type Member = {
  id: number;
  email: string;
  role: "COACH" | "PLAYER";
  preferredPosition?: string | null;
};

export type Squad = {
  id: number;
  name: string;
  coachId: number;
  membersCount?: number;
};

export type CreateSquadBody = {
  name: string;
};

export type AddMemberBody = {
  userId: number;
};

export type UserLookupBody = {
  email: string;
};

export type UserLookupResult = {
  id: number;
  email: string;
  role: "COACH" | "PLAYER";
};

export const squadsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createSquad: build.mutation<Squad, CreateSquadBody>({
      query: (body) => ({
        url: "/squads",
        method: "POST",
        body,
      }),
    }),

    getSquad: build.query<Squad, number>({
      query: (squadId) => ({
        url: `/squads/${squadId}`,
        method: "GET",
      }),
    }),

    getSquadMembers: build.query<Member[], number>({
      query: (squadId) => ({
        url: `/squads/${squadId}/members`,
        method: "GET",
      }),
    }),

    addMemberToSquad: build.mutation<
      { ok: true },
      { squadId: number; userId: number }
    >({
      query: ({ squadId, userId }) => ({
        url: `/squads/${squadId}/members`,
        method: "POST",
        body: { userId },
      }),
    }),

    lookupUserByEmail: build.mutation<UserLookupResult, UserLookupBody>({
      query: (body) => ({
        url: `/users:lookup`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateSquadMutation,
  useGetSquadQuery,
  useGetSquadMembersQuery,
  useAddMemberToSquadMutation,
  useLookupUserByEmailMutation,
} = squadsApi;
