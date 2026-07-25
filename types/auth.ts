export type Role = "worker" | "employer" | "admin";

export interface AuthState {
  error: string | null;
  success: boolean;
  otpSent?: boolean;
}
