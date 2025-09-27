import TagList from "@/components/common/Taglist";

export default function PopularTopicsSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Popular Topics</h2>
      <TagList tags={[
          'Linear Algebra', 'Calculus', 'Statistics', 'Algorithms',
          'Python', 'JavaScript', 'Machine Learning', 'Database Design'
          ]} />
    </div>
  )
}