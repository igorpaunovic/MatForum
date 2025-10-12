import { useQuery } from "@tanstack/react-query";
import questionService from "@/services/api-question-service";

export const useQuestionDetails = (questionId: string) => {
  return useQuery({
    queryKey: ['question', questionId],
    queryFn: () => questionService.getQuestionById(questionId),
    enabled: !!questionId,
  });
};

export const useSimilarQuestions = (questionId: string, count: number = 3) => {
  return useQuery({
    queryKey: ['similarQuestions', questionId, count],
    queryFn: () => questionService.getSimilarQuestions(questionId, count),
    enabled: !!questionId,
  });
};

