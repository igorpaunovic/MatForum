import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/app/router";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";

type Props = {
  router: typeof router
  client: QueryClient
}

export const Providers = ({ router, client }: Props) => {
  return (
    <QueryClientProvider client={client}>
        <RouterProvider router={router}/> 
        <Toaster position="top-right" richColors closeButton />
        <ReactQueryDevtools />
    </QueryClientProvider>
  )
}