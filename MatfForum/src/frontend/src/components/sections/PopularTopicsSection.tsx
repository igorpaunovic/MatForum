export default function PopularTopicsSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Popular Topics</h2>
      <div className="flex flex-wrap gap-2">
        {[
          'Linear Algebra', 'Calculus', 'Statistics', 'Algorithms',
          'Python', 'JavaScript', 'Machine Learning', 'Database Design'
        ].map(tag => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:shadow-md transition-shadow cursor-pointer"
          >
              {tag}
            </span>
        ))}
      </div>
    </div>
  )
}