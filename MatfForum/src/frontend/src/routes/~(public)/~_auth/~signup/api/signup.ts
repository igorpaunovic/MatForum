import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { authService, type SignUpRequest } from "@/services/auth-service";
import { meOptions } from "@/api/auth";

// Zod schema for signup request (matches backend)
const SignUpSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
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
      const errorData = error.response?.data;
      
      if (errorData) {
        // Handle specific validation errors from backend
        if (errorData.DuplicateUserName) {
          toast.error(`Username '${errorData.DuplicateUserName[0]?.split("'")[1]}' is already taken.`);
        } else if (errorData.DuplicateEmail) {
          toast.error(`Email '${errorData.DuplicateEmail[0]?.split("'")[1]}' is already registered.`);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          // Handle other validation errors
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            toast.error(firstError[0]);
          } else {
            toast.error("Registration failed. Please check your information.");
          }
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    },
  });
};
