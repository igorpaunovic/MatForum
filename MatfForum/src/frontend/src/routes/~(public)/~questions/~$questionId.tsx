import { createFileRoute } from '@tanstack/react-router';
import QuestionDetail from '@/components/features/questions/QuestionDetail';
import { useQuestionDetails } from '@/hooks/use-question-details';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/navbar';

export const Route = createFileRoute('/(public)/questions/$questionId')({
  component: QuestionDetailPage,
});

function QuestionDetailPage() {
  const { questionId } = Route.useParams();
  const { data: question, isPending, error } = useQuestionDetails(questionId);

  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4">
            <Skeleton className="h-6 w-32" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6 shadow-sm mb-6">
                <div className="flex gap-6">
                  {/* Voting Skeleton */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  
                  {/* Content Skeleton */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Answers Skeleton */}
              <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6 shadow-sm">
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="border border-gray-200 dark:border-[#343536] rounded-lg p-4">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Question</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </>
    );
  }

  if (!question) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Question Not Found</h2>
            <p className="text-gray-600">The question you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <QuestionDetail question={question} />
    </>
  );
}