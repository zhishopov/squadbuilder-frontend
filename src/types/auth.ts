export type Role = "COACH" | "PLAYER";

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
};
