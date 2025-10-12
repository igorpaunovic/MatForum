import { createFileRoute, Link } from '@tanstack/react-router'
import { useContributorProfile } from '@/hooks/use-contributor-profile'
import { Award, MessageSquare, HelpCircle, ArrowLeft, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Navbar from '@/components/layout/navbar'

export const Route = createFileRoute('/(public)/members/$userId')({
  component: ContributorProfilePage,
})

function ContributorProfilePage() {
  const { userId } = Route.useParams()
  const { data: profile, isPending, error } = useContributorProfile(userId)

  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Profile Header Skeleton */}
          <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-8 mb-6">
            <div className="flex items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64 mb-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-[#343536]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Skeleton className="h-8 w-8 mx-auto mb-2" />
                  <Skeleton className="h-6 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Questions Skeleton */}
          <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-gray-200 dark:border-[#343536] rounded-lg p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !profile) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load contributor profile</p>
        <Link to="/members">
          <Button variant="outline">Back to Members</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/members" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Members
      </Link>

      {/* Profile Header */}
      <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            {profile.username.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-[#D7DADC]">
              {profile.username}
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#818384] mb-4">
              {profile.firstName} {profile.lastName}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-[#818384]">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-[#343536]">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {profile.questionsCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-[#818384]">Questions</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {profile.answersCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-[#818384]">Answers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {profile.totalContributions}
            </div>
            <div className="text-sm text-gray-600 dark:text-[#818384]">Total Contributions</div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-[#D7DADC]">
          Questions by {profile.username}
        </h2>

        {profile.questions && profile.questions.length > 0 ? (
          <div className="space-y-4">
            {profile.questions.map((question) => (
              <Link
                key={question.id}
                to="/questions/$questionId"
                params={{ questionId: question.id }}
                className="block"
              >
                <div className="border border-gray-200 dark:border-[#343536] rounded-lg p-4 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {question.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-[#818384] ml-4">
                      <Eye className="w-4 h-4 mr-1" />
                      {question.views}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-[#D7DADC] mb-3 line-clamp-2">
                    {question.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 dark:bg-[#0079D3] text-blue-700 dark:text-white px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#818384]">
                      {new Date(question.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-[#272729] rounded-lg">
            <HelpCircle className="w-12 h-12 text-gray-400 dark:text-[#818384] mx-auto mb-3" />
            <p className="text-gray-600 dark:text-[#818384]">No questions yet</p>
          </div>
        )}
      </div>
      </div>
    </>
  )
}
