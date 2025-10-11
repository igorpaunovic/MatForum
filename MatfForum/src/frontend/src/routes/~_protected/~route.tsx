import { AppNav } from '@/components/app-nav'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { meOptions } from '@/api/auth'

export const Route = createFileRoute('/_protected')({
    beforeLoad: async ({ context }) => {
      const data = await context.queryClient.ensureQueryData(meOptions())
      
      if(!data){
        throw redirect({ to: "/login" });
      }
    },
    component: ProtectedLayout,
  })
  
  function ProtectedLayout() {
    return (
    <div className="dropdown-container min-h-svh flex flex-col">
        <AppNav /> 
        <main className="main-content flex-1"><Outlet /></main>
      </div>
    )
}
