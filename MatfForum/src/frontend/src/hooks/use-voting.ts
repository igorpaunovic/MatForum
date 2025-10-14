import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import votingService, { type VoteType, votingConfigKey } from "@/services/api-voting-service";
import { useMe } from "@/api/auth/me";

export const useVoteSummary = (questionId: string) => {
  const { data: me } = useMe();
  const userId = me?.id;

  return useQuery({
    queryKey: [votingConfigKey, "summary", questionId, userId],
    queryFn: () => votingService.getVoteSummary(questionId, userId as string),
    enabled: Boolean(questionId),
    staleTime: 1000 * 60, // 1 minut
  });
};

// Hook to fetch vote summaries for multiple questions
export const useMultipleVoteSummaries = (questionIds: string[]) => {
  const { data: me } = useMe();
  const userId = me?.id;

  return useQuery({
    queryKey: [votingConfigKey, "summaries", questionIds, userId],
    queryFn: async () => {
      const summaries = await Promise.all(
        questionIds.map(id => votingService.getVoteSummary(id, userId as string))
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
  const { data: me } = useMe();
  const userId = me?.id;

  return useMutation({
    mutationFn: (voteType: VoteType) => {
      if (!userId) throw new Error("Not authenticated");
      return votingService.vote({
        questionId,
        userId,
        voteType,
      });
    },
    onSuccess: () => {
      // Refresh vote summary nakon uspešnog glasanja
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", questionId, userId] 
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
  const { data: me } = useMe();
  const userId = me?.id;

  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("Not authenticated");
      return votingService.removeVote(questionId, null, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", questionId, userId] 
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
  const { data: me } = useMe();
  const userId = me?.id;

  return useQuery({
    queryKey: [votingConfigKey, "summary", "answer", answerId, userId],
    queryFn: () => votingService.getAnswerVoteSummary(answerId, userId as string),
    enabled: Boolean(answerId),
    staleTime: 1000 * 60, // 1 minut
  });
};

export const useAnswerVote = (answerId: string) => {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const userId = me?.id;

  return useMutation({
    mutationFn: (voteType: VoteType) => {
      if (!userId) throw new Error("Not authenticated");
      return votingService.vote({
        answerId,
        userId,
        voteType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", "answer", answerId, userId] 
      });
    },
  });
};

export const useRemoveAnswerVote = (answerId: string) => {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const userId = me?.id;

  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("Not authenticated");
      return votingService.removeVote(null, answerId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [votingConfigKey, "summary", "answer", answerId, userId] 
      });
    },
  });
};
