import QuestionCard from './QuestionCard';
import type { Question } from '@/lib/types'


interface QuestionListProps {
  questions: Question[];
}

const QuestionList = ({ questions }: QuestionListProps) => {
  return (
    <div className="space-y-4">
      {questions.map(question => (
        <QuestionCard key={question.id} {...question} />
      ))}
    </div>
  );
};

export default QuestionList;