import { useQuery } from '@tanstack/react-query';
import contributorService from '@/services/api-contributor-service';

export const useTopContributors = (count: number = 10) => {
  return useQuery({
    queryKey: ['topContributors', count],
    queryFn: () => contributorService.getTopContributors(count),
  });
};

