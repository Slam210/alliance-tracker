export type Role = "viewer" | "admin" | "guest";

export interface AuthContextValue {
  loading: boolean;
  authenticated: boolean;
  role: Role;

  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;

  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export type AuthState = {
  loading: boolean;
  authorized: boolean;
};

export interface AuthResponse {
  authenticated: boolean;
  role: Role;
}

export type AuthPayload = {
  allianceId: string;
  role: Role;
};

export interface LoginPayload {
  name: string;
  tag: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  tag: string;
  server: number | null;
  viewerPassword: string;
  adminPassword: string;
}
