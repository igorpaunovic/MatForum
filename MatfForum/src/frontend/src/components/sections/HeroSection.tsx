import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useTypewriter} from "@/hooks/useTypewriter";
import { useSlideIn} from "@/hooks/useSlideIn";

export default function HeroSection() {
  const headerVisible = useSlideIn(200)
  const { displayText, isTyping } = useTypewriter(
    "Your community for mathematics, programming, and academic discussions.",
    30,
    1000
  )

  return (
    <>
      <div className="text-center mb-12">
        <h1 className={`text-3xl font-bold mb-4 transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          Welcome to MATForum
        </h1>

        <p className="text-gray-600 mb-6 max-w-2xl mx-auto min-h-[3rem]">
          {displayText}
          <span
            className={`inline-block w-px h-5 bg-black align-middle ${
              isTyping ? "" : "animate-caret-blink"
            }`}
          />
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/questions">
            <Button variant="outline" className="hover:shadow-md transition-shadow">
              Browse Questions
            </Button>
          </Link>
          <Link to="/ask">
            <Button variant="outline" className="hover:shadow-md transition-shadow">
              Ask Question
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" className="hover:shadow-md transition-shadow">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="text-center p-4 border rounded hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-600">Questions</div>
        </div>
        <div className="text-center p-4 border rounded hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600">5,678</div>
          <div className="text-sm text-gray-600">Answers</div>
        </div>
        <div className="text-center p-4 border rounded hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-red-600">890</div>
          <div className="text-sm text-gray-600">Members</div>
        </div>
      </div>
    </>
  )
}

