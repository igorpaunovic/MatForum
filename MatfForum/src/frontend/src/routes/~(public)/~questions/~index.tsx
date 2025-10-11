import { createFileRoute, Link } from '@tanstack/react-router'
import QuestionList from '@/components/features/questions/QuestionList'
import useGetQuestions from '@/hooks/use-get-questions'
import { useSearchQuestions } from '@/hooks/use-search-questions'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'

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
      return allQuestions.filter((q: any) => q.id === questionId);
    }
    
    // Otherwise show all questions
    return allQuestions;
  }, [search, searchResults, questionId, allQuestions]);

  const isPending = search ? isSearching : isLoadingAll;

  if (isPending) return <div>Loading...</div>;
  if (!displayQuestions) return <div>Something went wrong</div>;

  const getTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (questionId) return 'Question Details';
    return 'Questions';
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
        {(search || questionId) && (
          <Link to="/questions">
            <Button variant="outline" size="sm">
              View All Questions
            </Button>
          </Link>
        )}
      </div>
      
      {displayQuestions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {search ? `No questions found for "${search}"` : 'No questions available'}
        </div>
      ) : (
        <QuestionList questions={displayQuestions} />
      )}
    </>
  );
}