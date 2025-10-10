import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { meOptions } from "@/api/auth";

export const Route = createFileRoute("/(public)/_auth")({
  component: AuthLayoutComponent,
  beforeLoad: async ({ context }) => {
    try {
      const data = await context.queryClient.ensureQueryData(meOptions());
      if (data) {
        throw redirect({ to: "/" });
      }
    } catch (error) {
      // If backend is not available or user is not authenticated, continue to auth pages
      console.log("Auth check failed, continuing to auth pages:", error);
    }
  },
});

function AuthLayoutComponent() {
  return (
    <div className="dropdown-container flex min-h-svh w-full flex-col items-center justify-center">
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}