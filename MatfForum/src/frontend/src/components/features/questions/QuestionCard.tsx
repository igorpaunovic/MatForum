import { useState, useEffect } from 'react';
import type { Question, Answer } from '@/lib/types'
import TagList from "@/components/common/Taglist.tsx";
import VotingButtons from "@/components/features/voting/VotingButtons";
import { Button } from '@/components/ui/button';
import AnswerForm from '@/components/features/answers/AnswerForm';
import AnswerList from '@/components/features/answers/AnswerList';
import answerService from '@/services/api-answer-service';
import { formatDate } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/api/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const QuestionCard = ({ id, title, content, authorName, createdByUserId, createdAt, updatedAt, tags, isClosed }: Question) => {
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editTags, setEditTags] = useState<string[]>(tags || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Auth check
  const { data: user } = useMe();
  const isAuthenticated = !!user;
  const isOwner = isAuthenticated && user?.id && createdByUserId && user.id === createdByUserId;

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

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const questionService = (await import('@/services/api-question-service')).default;
      await questionService.deleteQuestion(id);
      setShowDeleteConfirm(false);

      // Invalidate queries to refresh data smoothly
      await queryClient.invalidateQueries({ queryKey: ['questionConfig'] });
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
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
      if (!user?.id) {
        alert('You must be logged in to edit questions');
        return;
      }

      const questionService = (await import('@/services/api-question-service')).default;
      await questionService.updateQuestion(id, {
        title: editTitle,
        content: editContent,
        tags: editTags,
        updatedByUserId: user.id // ✅ Use actual authenticated user ID
      });
      setShowEditForm(false);

      // Invalidate queries to refresh data smoothly
      await queryClient.invalidateQueries({ queryKey: ['questionConfig'] });
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex-shrink-0">
          <VotingButtons questionId={id} user={user} />
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">
              {title}
              {isClosed && (
              <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full" title="This question is closed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Closed
              </span>
            )}</h3>
            <TooltipProvider>
              <div className="flex gap-2">
                {!isClosed && isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEditForm(!showEditForm)}
                        className="p-1 h-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit question</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1 h-auto text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete question</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {isOwner && (
                  <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Question</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this question? This action cannot be undone and will also delete all associated answers.
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
                )}
              </div>
            </TooltipProvider>
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
              isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  {showReplyForm ? 'Cancel' : 'Answer Question'}
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="text-gray-400 cursor-not-allowed"
                      >
                        Answer Question
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Login to answer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAnswers}
            >
              {showAnswers ? 'Hide Answers' : `Show Answers (${answerCount})`}
            </Button>
          </div>

          {/* Edit Form */}
          {showEditForm && (
            <div className="mt-4 border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold mb-3">Edit Question</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags.join(', ')}
                    onChange={(e) => setEditTags(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                    className="w-full border rounded px-3 py-2"
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