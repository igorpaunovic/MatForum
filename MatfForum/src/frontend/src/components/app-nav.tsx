import { Link } from '@tanstack/react-router'

export function AppNav() {
  return (
    <div className="p-2 flex gap-2 border-b bg-white/70 backdrop-blur">
      <Link to="/" className="[&.active]:font-semibold">Home</Link>
      <Link to="/questions" className="[&.active]:font-semibold">Questions</Link>
    </div>
  )
}