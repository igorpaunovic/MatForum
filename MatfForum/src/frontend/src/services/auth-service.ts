import { z } from "zod";
import createApi from "@/shared/api/api-factory";

// Zod schemas
const UserDetailsSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignUpRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
});

// Export types
export type UserDetails = z.infer<typeof UserDetailsSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

// Create shared API instances
const authApi = createApi({ commonPrefix: "authentication" });
const sessionApi = createApi({ commonPrefix: "auth" });

// Auth service functions
export const authService = {
  // Login function
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authApi.post("login", credentials);
    return AuthResponseSchema.parse(response.data);
  },

  // Signup function
  signup: async (data: SignUpRequest): Promise<void> => {
    await authApi.post("registeruser", data);
  },

  // Get current user session
  getCurrentUser: async (): Promise<UserDetails | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null; // No token, no need to call API
    }

    try {
      const response = await sessionApi.get("session");
      return UserDetailsSchema.parse(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Silently handle auth errors - don't log anything for 401/403
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Frontend Debug - Session API returned 401/403, but NOT removing token for debugging");
        return null;
      }
      // Only log unexpected errors
      console.error("Unexpected session error:", error);
      return null;
    }
  },

  // Token management
  storeToken: (token: string) => {
    localStorage.setItem("token", `Bearer ${token}`);
  },

  removeToken: () => {
    localStorage.removeItem("token");
  },
};
