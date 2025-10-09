import type { Answer } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface AnswerListProps {
  answers: Answer[];
}

const AnswerList = ({ answers }: AnswerListProps) => {
  if (answers.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No answers yet. Be the first to answer!
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h4 className="font-semibold text-lg">
        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
      </h4>
      {answers.map((answer) => (
        <div
          key={answer.id}
          className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r"
        >
          <p className="text-gray-800 mb-2">{answer.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {answer.authorName || 'Anonymous'}
            </span>
            <span>•</span>
            <span>
              {formatDate(answer.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnswerList;

