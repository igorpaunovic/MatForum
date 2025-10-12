import { Link } from '@tanstack/react-router';
import type { Question } from '@/lib/types';
import TagList from '@/components/common/Taglist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimilarQuestionsProps {
  questions: Question[];
}

const SimilarQuestions = ({ questions }: SimilarQuestionsProps) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 bg-white dark:bg-[#1A1A1B] border-gray-200 dark:border-[#343536]">
      <CardHeader>
        <CardTitle className="text-lg dark:text-[#D7DADC]">Similar Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <Link
              key={question.id}
              to="/questions/$questionId"
              params={{ questionId: question.id }}
              className="block p-4 border border-gray-200 dark:border-[#343536] rounded-lg hover:shadow-md transition-shadow hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-[#1A1A1B]"
            >
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-2">
                {question.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-[#818384] line-clamp-2 mb-2">
                {question.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#818384]">
                <span>By {question.authorName}</span>
                <span>{question.views} views</span>
              </div>
              {question.tags && question.tags.length > 0 && (
                <TagList tags={question.tags} />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarQuestions;

