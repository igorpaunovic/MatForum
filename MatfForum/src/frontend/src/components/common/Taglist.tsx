type TagListProps = {
  tags: string[]
  className?: string
}

export default function TagList({ tags, className = "" }: TagListProps) {
  return (
    <div className={`flex gap-2 mt-2 flex-wrap ${className}`}>
      {tags.map(tag => (
        <span
          key={tag}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
