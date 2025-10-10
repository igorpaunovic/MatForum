import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";

export default function CTASection() {
  return (
    <div className="text-center bg-gray-50 rounded p-8 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-4">Ready to Start Learning?</h2>
      <p className="text-gray-600 mb-6">Join our community of students and professionals.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/questions">
          <Button className="hover:shadow-md transition-shadow">
            Explore Questions
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline" className="hover:shadow-md transition-shadow">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  )
}