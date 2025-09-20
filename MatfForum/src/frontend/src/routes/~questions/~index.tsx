import { createFileRoute } from '@tanstack/react-router'
import QuestionList from '@/components/features/questions/QuestionList'
import useGetQuestions from '@/hooks/use-get-questions'

export const Route = createFileRoute('/questions/')({
  component: QuestionComponent,
})

function QuestionComponent() {
  const { data: questionsData, isPending } = useGetQuestions();

  if (isPending) return <div>Loading...</div>;
  if (!questionsData) return <div>Something went wrong</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Questions</h1>
      <QuestionList questions={questionsData} />
    </div>
  );
}