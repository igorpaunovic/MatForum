import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import votingService, { type VoteType, votingConfigKey } from "@/services/api-voting-service";

// Za sada koristimo hardkodovan userId - kasnije će biti iz auth konteksta
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

export const useVoteSummary = (questionId: string) => {
  return useQuery({
    queryKey: [votingConfigKey, "summary", questionId],
    queryFn: () => votingService.getVoteSummary(questionId, TEMP_USER_ID),
    staleTime: 1000 * 60, // 1 minut
  });
};

export const useVote = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voteType: VoteType) =>
      votingService.vote({
        questionId,
        userId: TEMP_USER_ID,
        voteType,
      }),
    onSuccess: () => {
      // Refresh vote summary nakon uspešnog glasanja
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", questionId] 
      });
    },
  });
};

export const useRemoveVote = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => votingService.removeVote(questionId, TEMP_USER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", questionId] 
      });
    },
  });
};
