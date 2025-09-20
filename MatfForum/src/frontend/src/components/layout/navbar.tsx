import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input.tsx";

const Navbar = () => {
  return (
    <nav className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <Link to="/" className="font-bold">
          MATForum
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <Input
            placeholder="Search questions..."
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <Link to="/" className="[&.active]:font-bold">Home</Link>
          <Link to="/questions" className="[&.active]:font-bold">Questions</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;