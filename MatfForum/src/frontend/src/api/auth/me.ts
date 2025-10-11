import { useQuery } from "@tanstack/react-query";
import { authService, type UserDetails } from "@/services/auth-service";

export const meOptions = () => ({
  queryKey: ["auth", "me"],
  queryFn: authService.getCurrentUser,
  staleTime: 5 * 60 * 1000, // 5 minutes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retry: (failureCount: number, error: any) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return false;
    }
    return failureCount < 3;
  },
});

export const useMe = () => {
  return useQuery(meOptions());
};

export type { UserDetails };
