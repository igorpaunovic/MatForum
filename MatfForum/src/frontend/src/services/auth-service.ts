import { z } from "zod";
import createApi from "@/shared/api/api-factory";

// Zod schemas
const UserDetailsSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

const LoginRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const SignUpRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});

// Export types
export type UserDetails = z.infer<typeof UserDetailsSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

// Create shared API instances
const authApi = createApi({ commonPrefix: "authentication" });
const userApi = createApi({ commonPrefix: "user" });

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
    try {
      const response = await userApi.get("session");
      return UserDetailsSchema.parse(response.data);
    } catch (error) {
      // If 401 or 403, user is not authenticated
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      throw error;
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
