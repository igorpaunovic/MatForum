// src/routes/~_protected/~ask.tsx
import { createFileRoute } from "@tanstack/react-router";
import QuestionForm from '@/routes/~_protected/~ask/components/CreateQuestionForm'

export const Route = createFileRoute("/_protected/ask")({
  component: AskQuestionComponent,
})

function AskQuestionComponent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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