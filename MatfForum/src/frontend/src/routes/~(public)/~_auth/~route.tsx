import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { meOptions } from "@/shared/api/auth";

export const Route = createFileRoute("/(public)/_auth")({
  component: AuthLayoutComponent,
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(meOptions());

    if (data) {
      throw redirect({ to: "/" });
    }
  },
});

function AuthLayoutComponent() {

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center">
      {"Matforum"}
      <div className="mt-10 flex items-center gap-2 px-4">
      </div>
      <Outlet />
    </div>
  );
}
