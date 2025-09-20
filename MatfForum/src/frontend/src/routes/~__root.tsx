import type { router } from '@/app/router'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import Navbar from "@/components/layout/navbar.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
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
  