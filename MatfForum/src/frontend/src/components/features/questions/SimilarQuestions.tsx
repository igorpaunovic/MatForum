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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Similar Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <Link
              key={question.id}
              to="/questions/$questionId"
              params={{ questionId: question.id }}
              className="block p-4 border rounded-lg hover:shadow-md transition-shadow hover:border-blue-500"
            >
              <h4 className="font-semibold text-blue-600 hover:text-blue-800 mb-2">
                {question.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {question.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
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

