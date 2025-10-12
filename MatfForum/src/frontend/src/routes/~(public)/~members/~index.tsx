import { createFileRoute, Link } from '@tanstack/react-router'
import { useTopContributors } from '@/hooks/use-top-contributors'
import { Award, MessageSquare, HelpCircle, User } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/(public)/members/')({
  component: MembersPage,
})

function MembersPage() {
  const { data: contributors, isPending, error } = useTopContributors(20)

  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 dark:border-[#343536] rounded-lg p-6 bg-white dark:bg-[#1A1A1B]">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-16 h-16 rounded-full mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 dark:text-red-400">Failed to load contributors</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-[#D7DADC]">Top Contributors</h1>
        <p className="text-gray-600 dark:text-[#818384]">
          Our most active community members who help others learn and grow
        </p>
      </div>

      {contributors && contributors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* treba da postoji index  */}
          {contributors.map((contributor) => (
            <Link
              key={contributor.id}
              to="/members/$userId"
              params={{ userId: contributor.id }}
              className="group"
            >
              <div className="border border-gray-200 dark:border-[#343536] rounded-lg p-6 hover:shadow-lg transition-all bg-white dark:bg-[#1A1A1B] hover:border-blue-500 dark:hover:border-blue-500">
                {/* Rank Badge ovo sam izbacio */}
                {/* {index < 3 && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                )} */}

                {/* Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    {contributor.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#D7DADC] group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {contributor.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#818384]">
                      {contributor.firstName} {contributor.lastName}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-[#818384]">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Questions
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {contributor.questionsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-[#818384]">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Answers
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {contributor.answersCount}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-[#343536]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-800 dark:text-[#D7DADC] font-medium">
                        <Award className="w-4 h-4 mr-2" />
                        Total Contributions
                      </span>
                      <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                        {contributor.totalContributions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#343536]">
                  <p className="text-xs text-gray-500 dark:text-[#818384]">
                    Member since {new Date(contributor.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#1A1A1B] rounded-lg">
          <User className="w-16 h-16 text-gray-400 dark:text-[#818384] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-[#818384]">No contributors found</p>
        </div>
      )}
      </div>
    </>
  )
}

