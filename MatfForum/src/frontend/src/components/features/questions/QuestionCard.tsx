import type { Question } from '@/lib/types'
import TagList from "@/components/common/Taglist.tsx";
import VotingButtons from "@/components/features/voting/VotingButtons";

const QuestionCard = ({ id, title, content, authorName, createdAt, tags }: Question) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex-shrink-0">
          <VotingButtons questionId={id} />
        </div>

        {/* Content Section */}
        <div className="flex-1">
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
      </div>
    </div>
  );
};

export default QuestionCard;