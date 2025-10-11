// src/routes/~questions/~new.tsx
import { createFileRoute } from "@tanstack/react-router";
import QuestionForm from '@/components/features/questions/CreateQuestionForm'

export const Route = createFileRoute('/questions/ask')({
  component: NewQuestionComponent,
})

function NewQuestionComponent() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ask a Question</h1>
      </div>

      <p className="text-gray-600 mb-8">
        Share your question with the community. Be specific and provide details to help others understand your problem.
      </p>

      <QuestionForm />
    </div>
  )
}