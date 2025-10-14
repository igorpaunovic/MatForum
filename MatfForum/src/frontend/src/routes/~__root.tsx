// import type { router } from '@/app/router'
// import { createRootRoute, Outlet } from '@tanstack/react-router'
// // import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
// import { Toaster } from 'sonner'
// import Navbar from "@/components/layout/navbar.tsx";

// export const Route = createRootRoute({
//   component: () => (
//     <>
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <Outlet />
//       </main>
//       <Toaster position="top-right" richColors closeButton />
//       <TanStackRouterDevtools />
//     </>
//   ),
// })

// declare module '@tanstack/react-router' {
//     interface Register {
//       router: typeof router
//     }
//   }
  
import { Toaster } from 'sonner'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import type { router } from '@/app/router'
import { queryClient } from '@/shared/api/queryClient'

export const Route = createRootRouteWithContext()({
  component: () => (
    <div className="min-h-screen">
      <main className="main-content">
        <Outlet />
      </main>
      <Toaster position="bottom-right" richColors closeButton />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
  beforeLoad: () => {
    return {
      queryClient,
    };
  },
})

declare module '@tanstack/react-router' {
    interface Register {
      router: typeof router 
    }
  } 
  