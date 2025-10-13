import { createFileRoute, Link } from '@tanstack/react-router'
import QuestionList from '@/components/features/questions/QuestionList'
import useGetQuestions from '@/hooks/use-get-questions'
import { useSearchQuestions } from '@/hooks/use-search-questions'
import { useMultipleVoteSummaries } from '@/hooks/use-voting'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Navbar from '@/components/layout/navbar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

type QuestionsSearch = {
  search?: string
  questionId?: string
  sort?: 'new' | 'best'
  time?: 'today' | 'week' | 'month' | 'all'
}

export const Route = createFileRoute('/(public)/questions/')({
  component: QuestionComponent,
  validateSearch: (search: Record<string, unknown>): QuestionsSearch => {
    return {
      search: search.search as string | undefined,
      questionId: search.questionId as string | undefined,
      sort: search.sort as 'new' | 'best' | undefined,
      time: search.time as 'today' | 'week' | 'month' | 'all' | undefined,
    }
  },
})

function QuestionComponent() {
  const { search, questionId, sort, time } = Route.useSearch()
  const [sortBy, setSortBy] = useState<'new' | 'best'>(sort || 'new');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>(time || 'all');
  
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
  
  // Fetch vote summaries for all displayed questions
  const questionIds = useMemo(() => 
    displayQuestions?.map(q => q.id) || [], 
    [displayQuestions]
  );
  const { data: voteSummaries, isPending: isLoadingVotes } = useMultipleVoteSummaries(questionIds);
  
  const sortedAndFilteredQuestions = useMemo(() => {
    if (!displayQuestions) return [];
    
    let filtered = [...displayQuestions];
    
    const now = new Date();
    if (timeFilter !== 'all') {
      filtered = filtered.filter(q => {
        const questionDate = new Date(q.createdAt);
        const diffInMs = now.getTime() - questionDate.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        
        switch(timeFilter) {
          case 'today':
            return diffInDays <= 1;
          case 'week':
            return diffInDays <= 7;
          case 'month':
            return diffInDays <= 30;
          default:
            return true;
        }
      });
    }
    
    if (sortBy === 'new') {
      filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'best') {
      // Sort by net votes (upvotes - downvotes)
      filtered.sort((a, b) => {
        const aVotes = voteSummaries?.[a.id];
        const bVotes = voteSummaries?.[b.id];
        const aNetScore = aVotes ? (aVotes.upvotes - aVotes.downvotes) : 0;
        const bNetScore = bVotes ? (bVotes.upvotes - bVotes.downvotes) : 0;
        return bNetScore - aNetScore;
      });
    }
    
    return filtered;
  }, [displayQuestions, sortBy, timeFilter, voteSummaries]);

  const isPending = search ? isSearching : isLoadingAll;

  if (isPending || isLoadingVotes) {
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
  if (!sortedAndFilteredQuestions) return <div>Something went wrong</div>;

  const getTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (questionId) return 'Question Details';
    return 'Questions';
  };

  const getSortLabel = () => {
    return sortBy === 'new' ? 'New' : 'Best';
  };

  const getTimeLabel = () => {
    switch(timeFilter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
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
        
        {/* Sorting and Filtering Dropdowns */}
        <div className="flex gap-3 mb-6">
          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {getSortLabel()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortBy('new')}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('best')}>
                Best
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Time Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {getTimeLabel()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setTimeFilter('today')}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('month')}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('all')}>
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {sortedAndFilteredQuestions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {search ? `No questions found for "${search}"` : 'No questions available'}
          </div>
        ) : (
          <QuestionList questions={sortedAndFilteredQuestions} />
        )}
      </div>
    </>
  );
}