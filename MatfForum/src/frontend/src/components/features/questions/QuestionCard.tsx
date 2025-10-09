import { useState, useEffect } from 'react';
import type { Question, Answer } from '@/lib/types'
import TagList from "@/components/common/Taglist.tsx";
import VotingButtons from "@/components/features/voting/VotingButtons";
import { Button } from '@/components/ui/button';
import AnswerForm from '@/components/features/answers/AnswerForm';
import AnswerList from '@/components/features/answers/AnswerList';
import answerService from '@/services/api-answer-service';
import { formatDate } from '@/lib/utils';

const QuestionCard = ({ id, title, content, authorName, createdAt, tags }: Question) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  // Load answer count on mount
  useEffect(() => {
    const loadAnswerCount = async () => {
      try {
        const data = await answerService.getAnswersByQuestionId(id);
        setAnswerCount(data.length);
      } catch (error) {
        console.error('Error loading answer count:', error);
      }
    };
    loadAnswerCount();
  }, [id]);

  const loadAnswers = async () => {
    setIsLoadingAnswers(true);
    try {
      const data = await answerService.getAnswersByQuestionId(id);
      setAnswers(data);
      setAnswerCount(data.length);
    } catch (error) {
      console.error('Error loading answers:', error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  useEffect(() => {
    if (showAnswers) {
      loadAnswers();
    }
  }, [showAnswers, id]);

  const handleAnswerSubmitted = () => {
    setShowReplyForm(false);
    loadAnswers();
    // Update count after new answer
    setAnswerCount(prev => prev + 1);
  };

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex-shrink-0">
          <VotingButtons questionId={id} />
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{content}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>By {authorName}</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          {tags && (
            <TagList tags={tags} />
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              {showReplyForm ? 'Cancel' : 'Answer Question'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAnswers}
            >
              {showAnswers ? 'Hide Answers' : `Show Answers (${answerCount})`}
            </Button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <AnswerForm
              questionId={id}
              onAnswerSubmitted={handleAnswerSubmitted}
              onCancel={() => setShowReplyForm(false)}
            />
          )}

          {/* Answers List */}
          {showAnswers && (
            <div className="mt-4">
              {isLoadingAnswers ? (
                <div className="text-center py-4 text-gray-500">Loading answers...</div>
              ) : (
                <AnswerList answers={answers} onReplySubmitted={loadAnswers} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;