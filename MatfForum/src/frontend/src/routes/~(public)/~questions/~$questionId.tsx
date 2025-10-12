import { createFileRoute } from '@tanstack/react-router';
import QuestionDetail from '@/components/features/questions/QuestionDetail';
import { useQuestionDetails } from '@/hooks/use-question-details';

export const Route = createFileRoute('/(public)/questions/$questionId')({
  component: QuestionDetailPage,
});

function QuestionDetailPage() {
  const { questionId } = Route.useParams();
  const { data: question, isPending, error } = useQuestionDetails(questionId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Question</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Question Not Found</h2>
          <p className="text-gray-600">The question you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <QuestionDetail question={question} />;
}

