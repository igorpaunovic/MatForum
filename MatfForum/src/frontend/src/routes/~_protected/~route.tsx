import Navbar from '@/components/layout/navbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { meOptions } from '@/api/auth'

export const Route = createFileRoute('/_protected')({
    beforeLoad: async ({ context }) => {
      const data = await context.queryClient.ensureQueryData(meOptions())
      console.log(data)
      if(!data){
        throw redirect({ to: "/login" });
      }
    },
    component: ProtectedLayout,
  })
  
  function ProtectedLayout() {
    return (
    <div className="dropdown-container min-h-svh flex flex-col">
        <Navbar /> 
        <main className="main-content flex-1"><Outlet /></main>
      </div>
    )
}
