import { ChevronUp, ChevronDown } from "lucide-react";
import { useVote, useVoteSummary, useRemoveVote } from "@/hooks/use-voting";
import { VOTE_TYPE_UPVOTE, VOTE_TYPE_DOWNVOTE } from "@/services/api-voting-service";
import { useMe } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Props za VotingButtons komponentu
 * @interface VotingButtonsProps
 */
interface VotingButtonsProps {
  /** ID pitanja za koje se glasuje */
  questionId: string;
  /** Trenutno ulogovani korisnik (opciono) */
  user?: { id: string } | null;
}

/**
 * Komponenta za glasanje (upvote/downvote) na pitanja
 * @component
 * @param {VotingButtonsProps} props - Props objekat
 * @param {string} props.questionId - ID pitanja
 * @param {Object} props.user - Trenutno ulogovani korisnik
 * @returns {JSX.Element} JSX element sa dugmićima za glasanje i prikazom rezultata
 * @example
 * ```tsx
 * <VotingButtons questionId="123" user={currentUser} />
 * ```
 * @description
 * Prikazuje dva dugmeta (upvote i downvote) sa trenutnim rezultatom glasanja.
 * Korisnici mogu glasati samo ako su ulogovani. Ako korisnik već glasao,
 * može promeniti glas ili ga ukloniti klikom na isto dugme.
 */
const VotingButtons = ({ questionId, user }: VotingButtonsProps) => {
  const { data: voteSummary, isPending } = useVoteSummary(questionId);
  const voteMutation = useVote(questionId);
  const removeVoteMutation = useRemoveVote(questionId);
  
  const isAuthenticated = !!user;

  if (isPending || !voteSummary) {
    return (
      <div className="flex flex-col items-center gap-1">
        <button 
          disabled 
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">...</span>
        <button 
          disabled 
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const handleUpvote = () => {
    if (!isAuthenticated) return;
    
    // Ako je već upvote, ukloni glas
    if (voteSummary.userVote === VOTE_TYPE_UPVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    // Inače, glasaj upvote
    voteMutation.mutate(VOTE_TYPE_UPVOTE);
  };

  const handleDownvote = () => {
    if (!isAuthenticated) return;
    
    // Ako je već downvote, ukloni glas
    if (voteSummary.userVote === VOTE_TYPE_DOWNVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    // Inače, glasaj downvote
    voteMutation.mutate(VOTE_TYPE_DOWNVOTE);
  };

  const netScore = voteSummary.upvotes - voteSummary.downvotes;
  const isUpvoted = voteSummary.userVote === VOTE_TYPE_UPVOTE;
  const isDownvoted = voteSummary.userVote === VOTE_TYPE_DOWNVOTE;
  const isLoading = voteMutation.isPending || removeVoteMutation.isPending;

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={isLoading || !isAuthenticated}
              className={`p-1 h-auto transition-colors ${
                isUpvoted
                  ? "text-green-600 bg-green-50 hover:bg-green-100 active:bg-green-200 dark:active:bg-green-900"
                  : isAuthenticated
                  ? "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-800 text-gray-600"
                  : "text-gray-400 cursor-not-allowed"
              } disabled:opacity-50`}
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isAuthenticated ? (isUpvoted ? "Remove upvote" : "Upvote") : "Login to vote"}</p>
          </TooltipContent>
        </Tooltip>
        
        <span 
          className={`text-sm font-medium ${
            netScore > 0 
              ? "text-green-600" 
              : netScore < 0 
              ? "text-red-600" 
              : "text-gray-600"
          }`}
        >
          {netScore > 0 ? `+${netScore}` : netScore}
        </span>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownvote}
              disabled={isLoading || !isAuthenticated}
              className={`p-1 h-auto transition-colors ${
                isDownvoted
                  ? "text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 dark:active:bg-red-900"
                  : isAuthenticated
                  ? "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-800 text-gray-600"
                  : "text-gray-400 cursor-not-allowed"
              } disabled:opacity-50`}
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isAuthenticated ? (isDownvoted ? "Remove downvote" : "Downvote") : "Login to vote"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default VotingButtons;
