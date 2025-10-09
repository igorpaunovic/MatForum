import { useState } from 'react';
import type { Answer } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import AnswerForm from './AnswerForm';
import { useAnswerVote, useAnswerVoteSummary, useRemoveAnswerVote } from '@/hooks/use-voting';
import { VOTE_TYPE_UPVOTE, VOTE_TYPE_DOWNVOTE } from '@/services/api-voting-service';

interface AnswerItemProps {
  answer: Answer;
  depth?: number;
  onReplySubmitted?: () => void;
}

const AnswerItem = ({ answer, depth = 0, onReplySubmitted }: AnswerItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  
  // Voting hooks
  const { data: voteSummary } = useAnswerVoteSummary(answer.id);
  const voteMutation = useAnswerVote(answer.id);
  const removeVoteMutation = useRemoveAnswerVote(answer.id);

  const handleReplySubmitted = () => {
    setShowReplyForm(false);
    if (onReplySubmitted) {
      onReplySubmitted();
    }
  };

  const handleUpvote = () => {
    if (voteSummary?.userVote === VOTE_TYPE_UPVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    voteMutation.mutate(VOTE_TYPE_UPVOTE);
  };

  const handleDownvote = () => {
    if (voteSummary?.userVote === VOTE_TYPE_DOWNVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    voteMutation.mutate(VOTE_TYPE_DOWNVOTE);
  };

  const replyCount = answer.replies?.length || 0;
  const hasReplies = replyCount > 0;
  const netScore = voteSummary ? voteSummary.upvotes - voteSummary.downvotes : 0;
  const isUpvoted = voteSummary?.userVote === VOTE_TYPE_UPVOTE;
  const isDownvoted = voteSummary?.userVote === VOTE_TYPE_DOWNVOTE;
  const isVoting = voteMutation.isPending || removeVoteMutation.isPending;

  // Reddit-style indentation - 24px per level, max 5 levels
  const maxDepth = 5;
  const actualDepth = Math.min(depth, maxDepth);
  const indentStyle = {
    marginLeft: `${actualDepth * 24}px`,
  };

  return (
    <div style={indentStyle} className="mb-3">
      <div
        className={`border-l-4 pl-4 py-3 rounded-r ${
          depth === 0 
            ? 'border-blue-500 bg-gray-50' 
            : 'border-gray-300 bg-white'
        }`}
      >
        <div className="flex gap-3">
          {/* Voting Section */}
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <button
              onClick={handleUpvote}
              disabled={isVoting}
              className={`p-0.5 rounded transition-colors ${
                isUpvoted
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "hover:bg-gray-100 text-gray-600"
              } disabled:opacity-50`}
              title={isUpvoted ? "Remove upvote" : "Upvote"}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            
            <span 
              className={`text-xs font-medium ${
                netScore > 0 
                  ? "text-green-600" 
                  : netScore < 0 
                  ? "text-red-600" 
                  : "text-gray-600"
              }`}
            >
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
            
            <button
              onClick={handleDownvote}
              disabled={isVoting}
              className={`p-0.5 rounded transition-colors ${
                isDownvoted
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "hover:bg-gray-100 text-gray-600"
              } disabled:opacity-50`}
              title={isDownvoted ? "Remove downvote" : "Downvote"}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            {/* Answer content */}
            <p className="text-gray-800 mb-2">{answer.content}</p>
            
            {/* Author and date */}
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <span>{answer.authorName || 'Anonymous'}</span>
              <span>•</span>
              <span>{formatDate(answer.createdAt)}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-7 px-2 text-xs"
              >
                {showReplyForm ? 'Cancel' : 'Reply'}
              </Button>

              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-7 px-2 text-xs"
                >
                  {showReplies 
                    ? `Hide ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`
                    : `Show ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`
                  }
                </Button>
              )}
            </div>

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-3">
                <AnswerForm
                  questionId={answer.questionId}
                  parentAnswerId={answer.id}
                  onAnswerSubmitted={handleReplySubmitted}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {showReplies && hasReplies && (
        <div className="mt-2">
          {answer.replies!.map((reply) => (
            <AnswerItem
              key={reply.id}
              answer={reply}
              depth={depth + 1}
              onReplySubmitted={onReplySubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnswerItem;
