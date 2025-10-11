// src/routes/~questions/~new.tsx
import { createFileRoute } from '@tanstack/react-router'
import QuestionForm from '@/components/features/questions/CreateQuestionForm'

export const Route = createFileRoute('/questions/ask')({
  component: NewQuestionComponent,
})

function NewQuestionComponent() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>
      <QuestionForm />
    </>
  )
}