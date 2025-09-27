import type { Question } from '@/lib/types'
import TagList from "@/components/common/Taglist.tsx";

const QuestionCard = ({ title, content, authorName, createdAt, tags }: Question) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>By {authorName}</span>
        <span>{createdAt}</span>
      </div>
      {tags && (
        <TagList tags={tags} />
      )}
    </div>
  );
};

export default QuestionCard;