// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { router } from "@/app/router";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { RouterProvider } from "@tanstack/react-router";
// import { Toaster } from "sonner";

// type Props = {
//   router: typeof router
//   client: QueryClient
// }

// export const Providers = ({ router, client }: Props) => {
//   return (
//     <QueryClientProvider client={client}>
//         <RouterProvider router={router}/> 
//         <Toaster position="top-right" richColors closeButton />
//         <ReactQueryDevtools />
//     </QueryClientProvider>
//   )
// }
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/app/router";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DefaultPendingComponent } from "@/components/default-pending-component";

type Props = {
  router: typeof router
  client: QueryClient
}

export const Providers = ({ router, client }: Props) => {

  return (
    <QueryClientProvider client={client}>
            {/* <RouterProvider router={router}/>  */}
        <Suspense fallback={<DefaultPendingComponent />}>  {/* ovde nisam siguran za fallback da li da bude Loading ili nesto drugo to treba videti */}
        {/* If you don't need auth in router context, render RouterProvider directly */}
            <RouterProvider router={router} />
            <TanStackRouterDevtools router={router} />
            <ReactQueryDevtools />
        </Suspense>
        <ReactQueryDevtools />
    </QueryClientProvider>
  )
}