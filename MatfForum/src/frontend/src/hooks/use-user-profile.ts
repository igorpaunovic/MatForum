import { useQuery } from '@tanstack/react-query';
import userProfileService from '@/services/api-user-profile-service';
import { useMe } from '@/api/auth';

export const useUserProfile = () => {
  const { data: authUser } = useMe();
  
  return useQuery({
    queryKey: ['userProfile', authUser?.id],
    queryFn: () => userProfileService.getUserProfile(authUser!.id),
    enabled: !!authUser?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userProfileService.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
