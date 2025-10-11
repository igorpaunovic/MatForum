import { useMutation, useQueryClient } from '@tanstack/react-query'
import questionService, { questionsConfigKey } from '@/services/api-question-service'
import type { CreateQuestionDTO } from "@/lib/types.ts";

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (question: CreateQuestionDTO) => {
      return questionService.createQuestion(question)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [questionsConfigKey] })
    }
  })
}