import QuestionCard from './QuestionCard';
import type { Question } from '@/lib/types'

/**
 * Props za QuestionList komponentu
 * @interface QuestionListProps
 */
interface QuestionListProps {
  /** Niz pitanja za prikaz */
  questions: Question[];
}

/**
 * Komponenta za prikaz liste pitanja
 * @component
 * @param {QuestionListProps} props - Props objekat
 * @param {Question[]} props.questions - Lista pitanja za prikaz
 * @returns {JSX.Element} JSX element sa listom pitanja
 * @example
 * ```tsx
 * <QuestionList questions={questions} />
 * ```
 */
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