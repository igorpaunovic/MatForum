import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { authService, type SignUpRequest } from "@/services/auth-service";
import { meOptions } from "@/shared/api/auth";

// Zod schema for signup request (matches backend)
const SignUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
});

export const zSignUpSchema = () => SignUpSchema;
export type SignUp = z.infer<typeof SignUpSchema>;

export const useSignUpEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "signUp", "email"],
    mutationFn: async (data: SignUp) => {
      const signUpRequest: SignUpRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email,
        phoneNumber: data.phoneNumber,
      };
      return await authService.signup(signUpRequest);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: meOptions().queryKey });
      toast.success("Account created successfully!", {
        description: "You can now log in with your credentials.",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });
};
