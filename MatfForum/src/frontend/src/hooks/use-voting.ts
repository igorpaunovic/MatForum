import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import votingService, { type VoteType, votingConfigKey } from "@/services/api-voting-service";

// Za sada koristimo hardkodovan userId - kasnije će biti iz auth konteksta
const TEMP_USER_ID = "550e8400-e29b-41d4-a716-446655440010";

export const useVoteSummary = (questionId: string) => {
  return useQuery({
    queryKey: [votingConfigKey, "summary", questionId],
    queryFn: () => votingService.getVoteSummary(questionId, TEMP_USER_ID),
    staleTime: 1000 * 60, // 1 minut
  });
};

// Hook to fetch vote summaries for multiple questions
export const useMultipleVoteSummaries = (questionIds: string[]) => {
  return useQuery({
    queryKey: [votingConfigKey, "summaries", questionIds],
    queryFn: async () => {
      const summaries = await Promise.all(
        questionIds.map(id => votingService.getVoteSummary(id, TEMP_USER_ID))
      );
      // Return as a map for easy lookup: { questionId: voteSummary }
      return summaries.reduce((acc, summary) => {
        if (summary.questionId) {
          acc[summary.questionId] = summary;
        }
        return acc;
      }, {} as Record<string, typeof summaries[0]>);
    },
    enabled: questionIds.length > 0,
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
      // Also invalidate the multiple summaries query
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summaries"] 
      });
    },
  });
};

export const useRemoveVote = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => votingService.removeVote(questionId, null, TEMP_USER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", questionId] 
      });
      // Also invalidate the multiple summaries query
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summaries"] 
      });
    },
  });
};

// Hooks for Answer voting
export const useAnswerVoteSummary = (answerId: string) => {
  return useQuery({
    queryKey: [votingConfigKey, "summary", "answer", answerId],
    queryFn: () => votingService.getAnswerVoteSummary(answerId, TEMP_USER_ID),
    staleTime: 1000 * 60, // 1 minut
  });
};

export const useAnswerVote = (answerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voteType: VoteType) =>
      votingService.vote({
        answerId,
        userId: TEMP_USER_ID,
        voteType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", "answer", answerId] 
      });
    },
  });
};

export const useRemoveAnswerVote = (answerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => votingService.removeVote(null, answerId, TEMP_USER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", "answer", answerId] 
      });
    },
  });
};
