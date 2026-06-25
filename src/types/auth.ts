export interface AuthContextValue {
  loading: boolean;
  authenticated: boolean;

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
}

export type AuthPayload = {
  allianceId: string;
  role: "viewer" | "admin";
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
