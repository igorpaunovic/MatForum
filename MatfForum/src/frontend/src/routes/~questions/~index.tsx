import PageLoader from '@/components/page-loader';
import useGetQuestions from '@/hooks/use-get-questions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/questions/')({
  component: QuestionComponent,
})

function QuestionComponent() {
  const { data: questionsData,  isPending } = useGetQuestions();

  if (isPending) return <PageLoader />;

  if (!questionsData) return <div>Something went wrong</div>;


    return (
    <div className="container mt-8 flex flex-col gap-8">
      {questionsData.map( (data: unknown) => (
        <div>{JSON.stringify(data, null, 2)}</div>
      ))}
    </div>
  );
}
