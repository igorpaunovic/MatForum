import { useState, useEffect } from 'react';
import type { Question, Answer } from '@/lib/types';
import TagList from "@/components/common/Taglist.tsx";
import VotingButtons from "@/components/features/voting/VotingButtons";
import { Button } from '@/components/ui/button';
import AnswerForm from '@/components/features/answers/AnswerForm';
import AnswerItem from '@/components/features/answers/AnswerItem';
import answerService from '@/services/api-answer-service';
import { formatDate } from '@/lib/utils';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import SimilarQuestions from './SimilarQuestions';
import { useSimilarQuestions } from '@/hooks/use-question-details';
import { useMe } from '@/api/auth';

interface QuestionDetailProps {
  question: Question;
}

const QuestionDetail = ({ question }: QuestionDetailProps) => {
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState(question.title);
  const [editContent, setEditContent] = useState(question.content);
  const [editTags, setEditTags] = useState<string[]>(question.tags || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch similar questions
  const { data: similarQuestions } = useSimilarQuestions(question.id);
  
  // Auth check
  const isAuthenticated = !!user;
  const isOwner = isAuthenticated && user?.id && question.createdByUserId && user.id === question.createdByUserId;

  // Load all answers on mount - they should be expanded by default
  useEffect(() => {
    const loadAnswers = async () => {
      setIsLoadingAnswers(true);
      try {
        const data = await answerService.getAnswersByQuestionId(question.id);
        setAnswers(data);
      } catch (error) {
        console.error('Error loading answers:', error);
      } finally {
        setIsLoadingAnswers(false);
      }
    };
    loadAnswers();
  }, [question.id]);

  const loadAnswers = async () => {
    setIsLoadingAnswers(true);
    try {
      const data = await answerService.getAnswersByQuestionId(question.id);
      setAnswers(data);
    } catch (error) {
      console.error('Error loading answers:', error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  const handleAnswerSubmitted = () => {
    setShowReplyForm(false);
    loadAnswers();
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const questionService = (await import('@/services/api-question-service')).default;
      await questionService.deleteQuestion(question.id);
      setShowDeleteConfirm(false);

      // Invalidate queries and navigate away
      await queryClient.invalidateQueries({ queryKey: ['questionConfig'] });
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      // Navigate to questions list
      window.location.href = '/questions';
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const questionService = (await import('@/services/api-question-service')).default;
      await questionService.updateQuestion(question.id, {
        title: editTitle,
        content: editContent,
        tags: editTags,
        updatedByUserId: '550e8400-e29b-41d4-a716-446655440010'
      });
      setShowEditForm(false);

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['question', question.id] });
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 mt-2">
        <Link 
          to="/questions" 
          className="inline-flex items-center text-gray-600 dark:text-[#818384] hover:text-gray-900 dark:hover:text-[#D7DADC] transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Questions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6 shadow-sm mb-6">
            <div className="flex gap-6">
              {/* Voting Section */}
              <div className="flex-shrink-0">
                <VotingButtons questionId={question.id} user={user} />
              </div>

              {/* Content Section */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold dark:text-[#D7DADC]">
                    {question.title}
                    {question.isClosed && (
                      <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full ml-3" title="This question is closed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Closed
                      </span>
                    )}
                  </h1>
                  {isOwner && (
                    <div className="flex gap-2">
                      {!question.isClosed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEditForm(!showEditForm)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 dark:text-[#D7DADC] text-lg">{question.content}</p>
                </div>

                {question.tags && question.tags.length > 0 && (
                  <TagList tags={question.tags} />
                )}

                <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-[#818384] mt-4 pt-4 border-t border-gray-200 dark:border-[#343536]">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Asked by {question.authorName}</span>
                    {question.isEdited && (
                      <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full" title={`Edited on ${formatDate(question.updatedAt)}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edited
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{formatDate(question.createdAt)}</span>
                    <span className="font-medium">{question.views} views</span>
                  </div>
                </div>

                {/* Edit Form */}
                {showEditForm && (
                  <div className="mt-6 border border-gray-200 dark:border-[#343536] rounded-lg p-4 bg-blue-50 dark:bg-[#272729]">
                    <h4 className="font-semibold mb-3 dark:text-[#D7DADC]">Edit Question</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-[#D7DADC]">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full border border-gray-300 dark:border-[#343536] rounded px-3 py-2 bg-white dark:bg-[#1A1A1B] dark:text-[#D7DADC]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-[#D7DADC]">Content</label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={6}
                          className="w-full border border-gray-300 dark:border-[#343536] rounded px-3 py-2 bg-white dark:bg-[#1A1A1B] dark:text-[#D7DADC]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-[#D7DADC]">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={editTags.join(', ')}
                          onChange={(e) => setEditTags(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                          className="w-full border border-gray-300 dark:border-[#343536] rounded px-3 py-2 bg-white dark:bg-[#1A1A1B] dark:text-[#D7DADC]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEdit} size="sm" disabled={isUpdating}>
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button onClick={() => setShowEditForm(false)} variant="outline" size="sm" disabled={isUpdating}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Answer Action Button */}
                {!question.isClosed && (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className={`w-full sm:w-auto ${!isAuthenticated ? 'text-gray-500 dark:text-[#818384] cursor-not-allowed border-gray-300 dark:border-[#343536]' : ''}`}
                      disabled={!isAuthenticated}
                    >
                      {showReplyForm ? 'Cancel' : 'Write an Answer'}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Login required
                      </p>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {showReplyForm && !question.isClosed && (
                  <div className="mt-4">
                    <AnswerForm
                      questionId={question.id}
                      onAnswerSubmitted={handleAnswerSubmitted}
                      onCancel={() => setShowReplyForm(false)}
                    />
                  </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1A1A1B] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-[#343536]">
                      <h3 className="text-lg font-semibold mb-3 dark:text-[#D7DADC]">Delete Question?</h3>
                      <p className="text-gray-600 dark:text-[#818384] mb-6">
                        Are you sure you want to delete this question? This action cannot be undone.
                      </p>
                      <div className="flex gap-3 justify-end">
                        <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" disabled={isDeleting}>
                          Cancel
                        </Button>
                        <Button onClick={handleDelete} variant="destructive" disabled={isDeleting}>
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 dark:text-[#D7DADC]">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>

            {isLoadingAnswers ? (
              <div className="text-center py-8 text-gray-500 dark:text-[#818384]">Loading answers...</div>
            ) : answers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-[#818384]">
                No answers yet. Be the first to answer!
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map((answer) => (
                  <AnswerItem
                    key={answer.id}
                    answer={answer}
                    depth={0}
                    onReplySubmitted={loadAnswers}
                    isClosed={question.isClosed}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SimilarQuestions questions={similarQuestions || []} />
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;

