import type { Answer } from '@/lib/types';
import AnswerItem from './AnswerItem';

interface AnswerListProps {
  answers: Answer[];
  onReplySubmitted?: () => void;
  isClosed: boolean;
}

const AnswerList = ({ answers, onReplySubmitted, isClosed }: AnswerListProps) => {
  if (answers.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-[#818384]">
        No answers yet. Be the first to answer!
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h4 className="font-semibold text-lg dark:text-[#D7DADC]">
        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
      </h4>
      {answers.map((answer) => (
        <AnswerItem
          key={answer.id}
          answer={answer}
          depth={0}
          onReplySubmitted={onReplySubmitted}
          isClosed={isClosed}
        />
      ))}
    </div>
  );
};

export default AnswerList;

