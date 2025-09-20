interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  tags?: string[];
  votes?: number;
}

const QuestionCard = ({ id, title, content, authorName, createdAt, tags, votes }: QuestionCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>By {authorName}</span>
        <span>{createdAt}</span>
      </div>
      {tags && (
        <div className="flex gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;