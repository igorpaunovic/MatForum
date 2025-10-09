import type { Answer } from '@/lib/types';
import AnswerItem from './AnswerItem';

interface AnswerListProps {
  answers: Answer[];
  onReplySubmitted?: () => void;
}

const AnswerList = ({ answers, onReplySubmitted }: AnswerListProps) => {
  if (answers.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No answers yet. Be the first to answer!
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h4 className="font-semibold text-lg">
        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
      </h4>
      {answers.map((answer) => (
        <AnswerItem
          key={answer.id}
          answer={answer}
          depth={0}
          onReplySubmitted={onReplySubmitted}
        />
      ))}
    </div>
  );
};

export default AnswerList;

