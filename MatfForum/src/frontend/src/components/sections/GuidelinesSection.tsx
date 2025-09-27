export default function GuidelinesSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Community Guidelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-3 text-green-600">Do's</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ask clear, specific questions</li>
            <li>• Show your work and provide context</li>
            <li>• Be respectful and constructive</li>
            <li>• Search before asking duplicates</li>
          </ul>
        </div>
        <div className="border rounded p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-3 text-red-600">Don'ts</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Don't ask homework without effort</li>
            <li>• Don't be rude or dismissive</li>
            <li>• Don't post off-topic content</li>
            <li>• Don't spam or self-promote</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

