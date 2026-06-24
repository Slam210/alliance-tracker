export type AuthState = {
  loading: boolean;
  authorized: boolean;
};

export type AuthPayload = {
  allianceId: string;
  role: "viewer" | "admin";
};
