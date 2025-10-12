import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import answerService from '@/services/api-answer-service';
import type { CreateAnswerRequest } from '@/lib/types';
import { useMe } from '@/api/auth';

interface AnswerFormProps {
  questionId: string;
  parentAnswerId?: string | null; // Optional - for replying to another answer
  onAnswerSubmitted?: () => void;
  onCancel?: () => void;
}

const AnswerForm = ({ questionId, parentAnswerId, onAnswerSubmitted, onCancel }: AnswerFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useMe(); // ovo je hit ka bekndu na /api/auth/session i on radi, mozda ovo da prosledi kao prop umesto sto ovde pozivam  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    if (!user?.id) {
      setError('You must be logged in to submit an answer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const request: CreateAnswerRequest = {
        content: content.trim(),
        questionId,
        userId: user.id, // ✅ Use correct field name for backend
        parentAnswerId: parentAnswerId || undefined
      };    

      await answerService.createAnswer(request);
      setContent('');
      onAnswerSubmitted?.();
    } catch (err) {
      console.error('Error creating answer:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReply = !!parentAnswerId;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-4 border border-gray-200 dark:border-[#343536] rounded-lg bg-gray-50 dark:bg-[#272729]">
      <div className="space-y-2">
        <Label htmlFor="answer-content" className="dark:text-[#D7DADC]">
          {isReply ? 'Your Reply' : 'Your Answer'}
        </Label>
        <textarea
          id="answer-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? "Write your reply here..." : "Write your answer here..."}
          className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input dark:border-[#343536] bg-white dark:bg-[#1A1A1B] text-sm dark:text-[#D7DADC] shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
          disabled={isSubmitting}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Submitting...' : (isReply ? 'Submit Reply' : 'Submit Answer')}
        </Button>
      </div>
    </form>
  );
};

export default AnswerForm;

