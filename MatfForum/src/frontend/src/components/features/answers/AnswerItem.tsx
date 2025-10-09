import { useState } from 'react';
import type { Answer } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AnswerForm from './AnswerForm';

interface AnswerItemProps {
  answer: Answer;
  depth?: number;
  onReplySubmitted?: () => void;
}

const AnswerItem = ({ answer, depth = 0, onReplySubmitted }: AnswerItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleReplySubmitted = () => {
    setShowReplyForm(false);
    if (onReplySubmitted) {
      onReplySubmitted();
    }
  };

  const replyCount = answer.replies?.length || 0;
  const hasReplies = replyCount > 0;

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
