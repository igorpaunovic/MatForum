import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { authService, type LoginRequest, type AuthResponse } from "@/services/auth-service";
import { meOptions } from "@/shared/api/auth";

// Simple labels object for form messages
const loginLabels = {
  username: {
    required: "Username is required",
  },
  password: {
    required: "Password is required",
    min: "Password must be at least 8 characters",
  },
  rememberMe: {
    required: "Remember me is required",
  },
};

export const zLoginSchema = () =>
  z.object({
    username: z.string().min(1, loginLabels.username.required),
    password: z.string().min(8, loginLabels.password.min),
    rememberMe: z.boolean(),
  });

export type Login = z.infer<ReturnType<typeof zLoginSchema>>;

export const useSignInEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "signIn", "email"],
    mutationFn: async (data: Login) => {
      const loginRequest: LoginRequest = {
        username: data.username,
        password: data.password,
      };
      return await authService.login(loginRequest);
    },
    onSuccess: (data: AuthResponse) => {
      authService.storeToken(data.accessToken);
      queryClient.removeQueries({ queryKey: meOptions().queryKey });
      toast.success("Successfully logged in!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

// Logout function
const logout = async (): Promise<void> => {
  authService.removeToken();
};

// Hook for logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
    onSuccess: () => {
      // Clear all queries after logout
      queryClient.clear();
      toast.success("Successfully logged out!");
    },
  });
};
