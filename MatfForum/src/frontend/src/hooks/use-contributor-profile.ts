import { useQuery } from '@tanstack/react-query';
import contributorService from '@/services/api-contributor-service';

export const useContributorProfile = (userId: string) => {
  return useQuery({
    queryKey: ['contributorProfile', userId],
    queryFn: () => contributorService.getContributorProfile(userId),
    enabled: !!userId,
  });
};

