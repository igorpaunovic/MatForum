import { useQuery } from "@tanstack/react-query";
import { authService, type UserDetails } from "@/services/auth-service";

// Query options for current user
export const meOptions = () => ({
  queryKey: ["auth", "me"],
  queryFn: authService.getCurrentUser,
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: (failureCount: number, error: any) => {
    // Don't retry on 401/403 errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      return false;
    }
    return failureCount < 3;
  },
});

// Hook to get current user
export const useMe = () => {
  return useQuery(meOptions());
};

// Re-export UserDetails type
export type { UserDetails };
