import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import { ControlTutorial } from "~/components/ui/control-tutorial";
import {
	ExitFullscreenIcon,
	FullscreenIcon,
} from "~/components/ui/icons";
import { GamePreview } from "~/components/ui/preview";
import { createControls } from "~/lib/controls";
import { games } from "~/lib/games";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [searchOpen, setSearchOpen] = createSignal(false);
	const [searchQuery, setSearchQuery] = createSignal("");
	const [controlTutorialOpen, setControlTutorialOpen] = createSignal(false);
	const [isFullscreen, setIsFullscreen] = createSignal(false);
	const controls = createControls();

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	onMount(() => {
		// Handle '/' key for search and 'F' for fullscreen
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "/" && !searchOpen()) {
				e.preventDefault();
				setSearchOpen(true);
			}
			if (e.key === "Escape") {
				if (searchOpen()) {
					setSearchOpen(false);
				}
				if (document.fullscreenElement) {
					document.exitFullscreen();
					setIsFullscreen(false);
				}
			}
			if (e.key === "F" || e.key === "f") {
				e.preventDefault();
				toggleFullscreen();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	});

	return (
		<main class="min-h-screen bg-black text-white p-8 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(255,69,0,0.08)_0%,transparent_60%)] before:pointer-events-none">
			<div class="max-w-7xl mx-auto">
				<header class="mb-8 flex justify-between items-center">
					<div class="flex items-baseline">
						<h1 class="text-4xl font-bold tracking-tighter font-['Press_Start_2P']">
							<span class="text-orange-500 mr-[-0.25em]">🔥</span>Play
						</h1>
					</div>
					<div class="flex gap-4">
						<Button
							variant="ghost"
							onClick={toggleFullscreen}
							class="flex items-center gap-2 backdrop-blur-md bg-white/5 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,69,0,0.4)] rounded-xl"
						>
							{isFullscreen() ? <ExitFullscreenIcon /> : <FullscreenIcon />}
							<span class="text-orange-500/50 text-sm">F</span>
						</Button>
						<Button
							variant="ghost"
							onClick={() => setControlTutorialOpen(true)}
							class="flex items-center gap-2 backdrop-blur-md bg-white/5 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,69,0,0.4)] rounded-xl"
						>
							<span class="text-orange-500/50 text-sm">↑↓←→</span>
						</Button>
					</div>
				</header>

				<div class="relative mb-6 group w-full max-w-lg mx-auto">
					<div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-hover:text-orange-500/70 transition-colors duration-300">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="w-5 h-5"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
					</div>
					<input
						type="text"
						placeholder={searchOpen() ? "Search games..." : "Press / to search"}
						class="w-full py-2 pl-10 pr-8 bg-[#1a1d21]/40 backdrop-blur-xl rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_rgba(255,69,0,0.1)] focus:shadow-[0_0_30px_rgba(255,69,0,0.15)] border border-orange-500/10 group-hover:border-orange-500/20 text-sm"
						value={searchQuery()}
						onInput={(e) => setSearchQuery(e.currentTarget.value)}
						onFocus={() => setSearchOpen(true)}
					/>
					<div class="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500/50 text-xs group-hover:text-orange-500/70 transition-colors duration-300">
						/
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn relative z-10 before:absolute before:-inset-8 before:bg-gradient-to-b before:from-black/0 before:via-orange-500/[0.03] before:to-black/0 before:pointer-events-none before:-z-10">
					{games
						.filter(
							(game) =>
								game.title
									.toLowerCase()
									.includes(searchQuery().toLowerCase()) ||
								game.category
									.toLowerCase()
									.includes(searchQuery().toLowerCase()),
						)
						.map((game) => (
							<GamePreview
								game={game}
								onPreviewStart={() => {
									console.log(`Preloading game: ${game.title}`);
								}}
								onPreviewEnd={() => {
									console.log(`Preview ended for: ${game.title}`);
								}}
							/>
						))}
				</div>
			</div>
			{/* <SplashCursor /> */}
			<ControlTutorial
				isOpen={controlTutorialOpen()}
				onClose={() => setControlTutorialOpen(false)}
			/>
		</main>
	);
}
