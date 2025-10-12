import { createFileRoute, Link } from '@tanstack/react-router'
import QuestionList from '@/components/features/questions/QuestionList'
import useGetQuestions from '@/hooks/use-get-questions'
import { useSearchQuestions } from '@/hooks/use-search-questions'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Navbar from '@/components/layout/navbar'

type QuestionsSearch = {
  search?: string
  questionId?: string
}

export const Route = createFileRoute('/(public)/questions/')({
  component: QuestionComponent,
  validateSearch: (search: Record<string, unknown>): QuestionsSearch => {
    return {
      search: search.search as string | undefined,
      questionId: search.questionId as string | undefined,
    }
  },
})

function QuestionComponent() {
  const { search, questionId } = Route.useSearch()
  const { data: allQuestions, isPending: isLoadingAll } = useGetQuestions();
  const { data: searchResults, isPending: isSearching } = useSearchQuestions(search || '');

  const displayQuestions = useMemo(() => {
    // If there's a search term, use search results
    if (search && searchResults) {
      return searchResults;
    }
    
    // If there's a questionId, filter to show only that question
    if (questionId && allQuestions) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return allQuestions.filter((q: any) => q.id === questionId);
    }
    
    // Otherwise show all questions
    return allQuestions;
  }, [search, searchResults, questionId, allQuestions]);

  const isPending = search ? isSearching : isLoadingAll;

  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  if (!displayQuestions) return <div>Something went wrong</div>;

  const getTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (questionId) return 'Question Details';
    return 'Questions';
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          <div className="flex gap-2">
            {(search || questionId) && (
              <Link to="/questions">
                <Button variant="outline" size="sm">
                  View All Questions
                </Button>
              </Link>
            )}
            <Link to="/ask">
              <Button size="sm">
                Ask Question
              </Button>
            </Link>
          </div>
        </div>
        
        {displayQuestions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {search ? `No questions found for "${search}"` : 'No questions available'}
          </div>
        ) : (
          <QuestionList questions={displayQuestions} />
        )}
      </div>
    </>
  );
}