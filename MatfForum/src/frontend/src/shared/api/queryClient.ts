import { MutationCache, QueryCache, QueryClient, type QueryClientConfig } from "@tanstack/react-query";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export const queryClientConfig: QueryClientConfig = {
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err instanceof ZodError) {
        const zodErr = fromZodError(err);
        toast.error(zodErr.message);
      }
    },
  }),
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof ZodError) {
        const zodErr = fromZodError(err);
        toast.error(zodErr.message);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);