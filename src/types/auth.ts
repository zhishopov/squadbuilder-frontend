export type Role = "COACH" | "PLAYER";

export type CurrentUser = {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
} | null;
