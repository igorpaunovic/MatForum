import { useState } from 'react';
import type { Answer } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import AnswerForm from './AnswerForm';
import { useAnswerVote, useAnswerVoteSummary, useRemoveAnswerVote } from '@/hooks/use-voting';
import { VOTE_TYPE_UPVOTE, VOTE_TYPE_DOWNVOTE } from '@/services/api-voting-service';
import answerService from '@/services/api-answer-service';
import { useMe } from '@/api/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AnswerItemProps {
  answer: Answer;
  depth?: number;
  onReplySubmitted?: () => void;
}

const AnswerItem = ({ answer, depth = 0, onReplySubmitted }: AnswerItemProps) => {
  // const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Auth check
  const { data: user } = useMe();
  const isAuthenticated = !!user;
  const isOwner = isAuthenticated && user?.id && answer.authorId && user.id === answer.authorId;
  
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
    if (!isAuthenticated) return;
    
    if (voteSummary?.userVote === VOTE_TYPE_UPVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    voteMutation.mutate(VOTE_TYPE_UPVOTE);
  };

  const handleDownvote = () => {
    if (!isAuthenticated) return;
    
    if (voteSummary?.userVote === VOTE_TYPE_DOWNVOTE) {
      removeVoteMutation.mutate();
      return;
    }
    voteMutation.mutate(VOTE_TYPE_DOWNVOTE);
  };

  const handleEdit = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      await answerService.updateAnswer(answer.id, editContent);
      setShowEditForm(false);
      
      // Invalidate queries to refresh answers smoothly
      if (onReplySubmitted) {
        onReplySubmitted();
      }
    } catch (error) {
      console.error('Error updating answer:', error);
      alert('Failed to update answer');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    
    try {
      await answerService.deleteAnswer(answer.id);
      setShowDeleteConfirm(false);
      
      // Trigger refresh of answers
      if (onReplySubmitted) {
        onReplySubmitted();
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
      alert('Failed to delete answer');
    } finally {
      setIsDeleting(false);
    }
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
          <TooltipProvider>
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUpvote}
                    disabled={isVoting || !isAuthenticated}
                    className={`p-0.5 h-auto transition-colors ${
                      isUpvoted
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : isAuthenticated
                        ? "hover:bg-gray-100 text-gray-600"
                        : "text-gray-400 cursor-not-allowed"
                    } disabled:opacity-50`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isAuthenticated ? (isUpvoted ? "Remove upvote" : "Upvote") : "Login to vote"}</p>
                </TooltipContent>
              </Tooltip>
              
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
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownvote}
                    disabled={isVoting || !isAuthenticated}
                    className={`p-0.5 h-auto transition-colors ${
                      isDownvoted
                        ? "text-red-600 bg-red-50 hover:bg-red-100"
                        : isAuthenticated
                        ? "hover:bg-gray-100 text-gray-600"
                        : "text-gray-400 cursor-not-allowed"
                    } disabled:opacity-50`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isAuthenticated ? (isDownvoted ? "Remove downvote" : "Downvote") : "Login to vote"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Content Section */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              {/* Answer content */}
              <div className="flex-1">
                {showEditForm ? (
                  <div className="mb-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button onClick={handleEdit} size="sm" disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowEditForm(false);
                          setEditContent(answer.content);
                        }} 
                        variant="outline" 
                        size="sm"
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800">{answer.content}</p>
                )}
              </div>
              
              {/* Edit/Delete icons - Only show for owner */}
              {!showEditForm && isOwner && (
                <TooltipProvider>
                  <div className="flex gap-1 ml-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEditForm(true)}
                          className="p-1 h-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit answer</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="p-1 h-auto text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete answer</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Answer</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this answer? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipProvider>
              )}
            </div>
            
            {/* Author and date */}
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <span>{answer.authorName || 'Anonymous'}</span>
              <span>•</span>
              <span>{formatDate(answer.createdAt)}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-7 px-2 text-xs"
                >
                  {showReplyForm ? 'Cancel' : 'Reply'}
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="h-7 px-2 text-xs text-gray-400 cursor-not-allowed"
                      >
                        Reply
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Login to reply</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

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
