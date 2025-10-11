import { useState, useEffect } from 'react';
import type { Question, Answer } from '@/lib/types'
import TagList from "@/components/common/Taglist.tsx";
import VotingButtons from "@/components/features/voting/VotingButtons";
import { Button } from '@/components/ui/button';
import AnswerForm from '@/components/features/answers/AnswerForm';
import AnswerList from '@/components/features/answers/AnswerList';
import answerService from '@/services/api-answer-service';
import { formatDate } from '@/lib/utils';

const QuestionCard = ({ id, title, content, authorName, createdAt, updatedAt, tags, isClosed }: Question) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  const isEdited = updatedAt && createdAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();

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
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            {isClosed && (
              <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full" title="This question is closed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Closed
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-3">{content}</p>

          <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
            <span>By {authorName}</span>
            <div className="flex items-center gap-2">
              {isEdited && (
                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full" title={`Edited on ${formatDate(updatedAt)}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edited
                 </span>
              )}
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {tags && (
            <TagList tags={tags} />
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {!isClosed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                {showReplyForm ? 'Cancel' : 'Answer Question'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAnswers}
            >
              {showAnswers ? 'Hide Answers' : `Show Answers (${answerCount})`}
            </Button>
          </div>

          {/* Reply Form */}
          {showReplyForm && !isClosed && (
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