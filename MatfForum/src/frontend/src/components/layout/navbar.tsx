import { Link, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input.tsx";
import { useState, useEffect, useRef } from "react";
import { useSearchQuestions } from "@/hooks/use-search-questions";
import { SimpleUserMenu } from "@/components/simple-user-menu.tsx";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/components/common/Logo.tsx";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useSearchQuestions(debouncedSearchTerm);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuestionClick = (questionId: string) => {
    setShowResults(false);
    setSearchTerm("");
    navigate({ to: `/questions/$questionId`, params: { questionId } });
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && debouncedSearchTerm.trim()) {
      setShowResults(false);
      setSearchTerm("");
      navigate({ to: `/questions`, search: { search: debouncedSearchTerm } });
    }
  };

  return (
    <nav className="bg-white dark:bg-[#1A1A1B] border-b border-gray-200 dark:border-[#343536] px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto gap-4">
        <Link to="/" className="font-bold text-gray-900 dark:text-[#D7DADC] flex-shrink-0">
          <div className="flex items-center">
            <Logo size="small" />
            <span className="ml-1 text-xl font-bold text-gray-800">MATForum</span>
          </div>
        </Link>

        <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
          <Input
            placeholder="Search questions..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => searchTerm && setShowResults(true)}
            onKeyDown={handleSearchEnter}
          />
          
          {/* Search Results Dropdown */}
          {showResults && debouncedSearchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1B] border border-gray-200 dark:border-[#343536] rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500 dark:text-[#818384]">
                  Searching...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((question: any) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#272729] border-b border-gray-200 dark:border-[#343536] last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-sm mb-1 text-gray-900 dark:text-[#D7DADC]">{question.title}</div>
                      <div className="text-xs text-gray-500 dark:text-[#818384] line-clamp-2">
                        {question.content}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {question.tags && question.tags.map((tag: string) => (
                          <span key={tag} className="text-xs bg-blue-100 dark:bg-[#0079D3] text-blue-700 dark:text-white px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-[#818384]">
                  No results for "{debouncedSearchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 items-center flex-shrink-0">
          <Link to="/" className="[&.active]:font-bold text-gray-700 dark:text-[#D7DADC] hover:text-gray-900 dark:hover:text-white whitespace-nowrap">Home</Link>
          <Link to="/questions" className="[&.active]:font-bold text-gray-700 dark:text-[#D7DADC] hover:text-gray-900 dark:hover:text-white whitespace-nowrap">Questions</Link>
          <Link to="/members" className="[&.active]:font-bold text-gray-700 dark:text-[#D7DADC] hover:text-gray-900 dark:hover:text-white whitespace-nowrap">Members</Link>
          <ThemeToggle />
          <SimpleUserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;