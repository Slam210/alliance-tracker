import { AuthState, LoginPayload, SignupPayload } from "../types/auth";
import { apiJson, apiRequest } from "./client";

export const getCurrentUser = () => apiRequest<AuthState>("/api/auth/me");

export const login = (payload: LoginPayload) =>
  apiJson("/api/auth/signin", "POST", payload);

export const signup = (payload: SignupPayload) =>
  apiJson("/api/auth/signup", "POST", payload);

export const logout = () => apiJson("/api/auth/logout", "POST");
