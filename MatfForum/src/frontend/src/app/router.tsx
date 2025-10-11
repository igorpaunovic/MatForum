// import { createRouter } from '@tanstack/react-router'
// import { routeTree } from '../routeTree.gen' 

// export const router = createRouter({
//   routeTree,
// })

import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen' 

import { DefaultErrorComponent } from "@/components/default-error-component";
import { DefaultPendingComponent } from "@/components/default-pending-component";


export const router = createRouter({
  routeTree,
  defaultPendingComponent: DefaultPendingComponent,
  defaultErrorComponent: ({ error }: { error: Error }) => <DefaultErrorComponent error={error} />,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

