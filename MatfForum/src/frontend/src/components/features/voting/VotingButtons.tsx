import { ChevronUp, ChevronDown } from "lucide-react";
import { useVote, useVoteSummary, useRemoveVote } from "@/hooks/use-voting";
import { VOTE_TYPE_UPVOTE, VOTE_TYPE_DOWNVOTE } from "@/services/api-voting-service";

interface VotingButtonsProps {
  questionId: string;
}

const VotingButtons = ({ questionId }: VotingButtonsProps) => {
  const { data: voteSummary, isPending } = useVoteSummary(questionId);
  const voteMutation = useVote(questionId);
  const removeVoteMutation = useRemoveVote(questionId);

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
    // Ako je već upvote, ukloni glas
    if (voteSummary.userVote === VOTE_TYPE_UPVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    // Inače, glasaj upvote
    voteMutation.mutate(VOTE_TYPE_UPVOTE);
  };

  const handleDownvote = () => {
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
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleUpvote}
        disabled={isLoading}
        className={`p-1 rounded transition-colors ${
          isUpvoted
            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
            : "hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-600 dark:text-[#818384]"
        } disabled:opacity-50 cursor-pointer`}
        title={isUpvoted ? "Remove upvote" : "Upvote"}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      
      <span 
        className={`text-sm font-medium ${
          netScore > 0 
            ? "text-green-600 dark:text-green-400" 
            : netScore < 0 
            ? "text-red-600 dark:text-red-400" 
            : "text-gray-600 dark:text-[#818384]"
        }`}
      >
        {netScore > 0 ? `+${netScore}` : netScore}
      </span>
      
      <button
        onClick={handleDownvote}
        disabled={isLoading}
        className={`p-1 rounded transition-colors ${
          isDownvoted
            ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
            : "hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-600 dark:text-[#818384]"
        } disabled:opacity-50 cursor-pointer`}
        title={isDownvoted ? "Remove downvote" : "Downvote"}
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};

export default VotingButtons;
