import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";
import TanstackQueryProvider from "../integrations/tanstack-query/provider";

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
				{/* <TanStackRouterDevtools /> */}
			</TanstackQueryProvider>
		</>
	);
}
