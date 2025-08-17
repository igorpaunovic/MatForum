import type { router } from '@/app/router'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/questions" className="[&.active]:font-bold">
          Questions
        </Link>{' '}
      </div>
      <hr />
      <Outlet />
       <Toaster position="top-right" richColors closeButton />
      <TanStackRouterDevtools />
    </>
  ),
})

declare module '@tanstack/react-router' {
    interface Register {
      router: typeof router
    }
  }
  