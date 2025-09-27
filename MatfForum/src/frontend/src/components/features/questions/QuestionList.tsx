import QuestionCard from './QuestionCard';

interface Question {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  tags?: string[];
  votes?: number;
}

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