import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";
import TanstackQueryProvider from "../integrations/tanstack-query/provider";

import { Toaster } from "~/components/ui/toast";
import Header from "../components/Header";

export const Route = createRootRouteWithContext()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<TanstackQueryProvider>
				<Header />

				<Outlet />
				<Toaster />
				{/* <TanStackRouterDevtools /> */}
			</TanstackQueryProvider>
		</>
	);
}
