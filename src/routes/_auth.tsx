import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionFn } from "@/server/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session) {
      throw redirect({ to: "/" });
    }
    return { session };
  },
  component: () => <Outlet />,
});
