export default function QuickStartSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6 text-center">Getting Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 border rounded hover:shadow-md transition-shadow">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold shadow-lg">
            1
          </div>
          <h3 className="font-semibold mb-2">Create Account</h3>
          <p className="text-sm text-gray-600">Sign up with your university email</p>
        </div>
        <div className="text-center p-4 border rounded hover:shadow-md transition-shadow">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold shadow-lg">
            2
          </div>
          <h3 className="font-semibold mb-2">Ask Questions</h3>
          <p className="text-sm text-gray-600">Post your questions with proper formatting</p>
        </div>
        <div className="text-center p-4 border rounded hover:shadow-md transition-shadow">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold shadow-lg">
            3
          </div>
          <h3 className="font-semibold mb-2">Get Answers</h3>
          <p className="text-sm text-gray-600">Receive expert answers from the community</p>
        </div>
      </div>
    </div>
  )
}