import { useMutation, useQueryClient } from '@tanstack/react-query'
import questionService from '@/services/api-question-service'
import type { Question } from "@/lib/types.ts";

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (question: Question) => {
      return questionService.createQuestion(question)
    },
    onSuccess: () => {
      // Invalidate questions cache to refetch the list
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    }
  })
}