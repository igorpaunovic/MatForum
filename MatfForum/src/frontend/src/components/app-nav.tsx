import { Link } from '@tanstack/react-router'
import { UserMenu } from './user-menu'

export function AppNav() {
  return (
    <div className="p-2 flex justify-between items-center border-b bg-white/70 backdrop-blur">
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:font-semibold">Home</Link>
        <Link to="/questions" className="[&.active]:font-semibold">Questions</Link>
      </div>
      <UserMenu />
    </div>
  )
}