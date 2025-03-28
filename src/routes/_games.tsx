import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from "@tanstack/solid-router";
import { createEffect } from "solid-js";
import { Button } from "~/components/ui/button";
import { createFullscreen } from "~/lib/fullscreen";

export const Route = createFileRoute("/_games")({
	component: RouteComponent,
});

function RouteComponent() {
	const location = useLocation();
	const currentRoute =
		location().pathname.split("/").pop()?.toUpperCase() || "GAMES";
	const [isFullScreen, , toggleFullscreen] = createFullscreen();

	createEffect(() => {
		if (!isFullScreen()) toggleFullscreen({ saveToLocal: false });
	}, [isFullScreen]);

	return (
		<div class="min-h-screen bg-black text-white">
			<header class="sticky top-0 backdrop-blur-xl bg-black/30 border-b border-orange-500/10 shadow-lg shadow-orange-500/5 z-50">
				<div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
					<Link to="/" class="group">
						<Button
							variant="ghost"
							class="flex items-center gap-2 backdrop-blur-md bg-white/5 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,69,0,0.4)] rounded-xl"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 text-orange-500/70 transition-transform duration-300 group-hover:-translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back
						</Button>
					</Link>
					<div class="text-lg font-bold tracking-wider text-orange-500/90">
						{currentRoute}
					</div>
				</div>
			</header>
			<main class="max-w-7xl mx-auto p-4">
				<Outlet />
			</main>
		</div>
	);
}
