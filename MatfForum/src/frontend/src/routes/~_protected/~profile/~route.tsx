import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '@/api/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar } from 'lucide-react'
import Logo from "@/components/common/Logo.tsx";

export const Route = createFileRoute('/_protected/profile')({
  component: ProfileComponent,
})

function ProfileComponent() {
  const { data: user, isLoading, error } = useMe()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Logo size="large" className="mx-auto mb-6" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-600">Not Authenticated</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <Logo size="large" className="mx-auto mb-6" />
              <CardTitle className="text-3xl font-bold text-gray-800">User Profile</CardTitle>
              <CardDescription className="text-gray-600 text-lg">Your MatForum account information</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">First Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-800">{user.firstName}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Last Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-800">{user.lastName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-600" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-800">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    Account Information
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">User ID</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-800 font-mono text-sm">{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}