import { Link } from "@tanstack/solid-router";
import { type JSX, Show, createSignal } from "solid-js";
import type { Game } from "~/lib/games";
import { Dialog } from "./dialog";

interface PreviewProps {
	isOpen: boolean;
	onClose: () => void;
	children: JSX.Element;
	title?: string;
	isFullscreen?: boolean;
	onFullscreenChange?: (isFullscreen: boolean) => void;
}

export function Preview(props: PreviewProps) {
	return (
		<Show when={props.isOpen}>
			<Dialog isOpen={props.isOpen} onClose={props.onClose} title={props.title}>
				<div class="relative w-full aspect-video bg-[#1a1d21]/95 backdrop-blur-lg rounded-lg overflow-hidden group border border-orange-500/10 shadow-lg shadow-orange-900/20 hover:shadow-[0_0_40px_rgba(255,69,0,0.15)] transition-all duration-300 hover:scale-[1.02]">
					<div class="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
						<button
							class="p-2 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 hover:text-orange-400 transform hover:scale-110 transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,69,0,0.3)]"
							onClick={() => props.onFullscreenChange?.(!props.isFullscreen)}
							title="Toggle Fullscreen"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class={`w-5 h-5 transition-transform duration-200 ${props.isFullscreen ? "scale-90" : "scale-100"}`}
							>
								{props.isFullscreen ? (
									<>
										<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
									</>
								) : (
									<>
										<path d="M15 3h6v6M9 21H3v-6M21 9v6h-6M3 9v6h6" />
									</>
								)}
							</svg>
						</button>
						<button
							class="p-2 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 hover:text-orange-400 transform hover:scale-110 transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,69,0,0.3)]"
							onClick={props.onClose}
							title="Close Preview"
						>
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
								<path d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div
						class={`relative w-full h-full ${props.isFullscreen ? "fixed inset-0 z-50 bg-black/95 backdrop-blur-lg" : ""}`}
					>
						{props.children}
					</div>

					{/* Fiery glow effect */}
					<div class="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
				</div>
			</Dialog>
		</Show>
	);
}

interface GamePreviewProps {
	game: Game;
	onPreviewStart?: () => void;
	onPreviewEnd?: () => void;
}

export function GamePreview(props: GamePreviewProps) {
	const [isPreviewOpen, setIsPreviewOpen] = createSignal(false);
	const [isFullscreen, setIsFullscreen] = createSignal(false);
	const [longPressTimer, setLongPressTimer] = createSignal<number>();
	const [showPreviewIcon, setShowPreviewIcon] = createSignal(false);

	const handlePreviewStart = () => {
		setIsPreviewOpen(true);
		props.onPreviewStart?.();
	};

	const handlePreviewEnd = () => {
		setIsPreviewOpen(false);
		props.onPreviewEnd?.();
	};

	const handleTouchStart = () => {
		const timer = window.setTimeout(() => {
			handlePreviewStart();
		}, 500);
		setLongPressTimer(timer);
	};

	const handleTouchEnd = () => {
		if (longPressTimer()) {
			window.clearTimeout(longPressTimer());
			setLongPressTimer();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "p" || e.key === "P") {
			e.preventDefault();
			handlePreviewStart();
		}
	};

	return (
		<Link
			to={props.game.url}
			class="group relative p-6 bg-[#1a1d21]/40 bg-opacity-30 backdrop-blur-xl rounded-xl hover:bg-[#2c3038]/95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:shadow-[0_0_35px_rgba(255,69,0,0.25)] hover:scale-[1.03] hover:-translate-y-1 border border-orange-500/10 hover:border-orange-500/20"
			tabIndex={0}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchEnd}
			onMouseEnter={() => setShowPreviewIcon(true)}
			onMouseLeave={() => setShowPreviewIcon(false)}
			onKeyDown={handleKeyDown}
		>
			<div class="relative z-10">
				<h3 class="text-xl font-semibold mb-2 text-orange-50 group-hover:text-orange-100 transition-colors">
					{props.game.title}
				</h3>
				<span class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
					{props.game.category}
				</span>
			</div>

			{/* Fiery glow effect */}
			<div class="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/[0.02] to-orange-500/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
			<div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,69,0,0.1)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

			{/* Preview Icon */}
			<Show when={showPreviewIcon()}>
				<button
					class="absolute top-4 right-4 p-2 rounded-full bg-orange-500/10 text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500/20 hover:text-orange-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,69,0,0.3)]"
					onClick={handlePreviewStart}
					title="Preview Game (P)"
				>
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
						<polygon points="5 3 19 12 5 21 5 3" />
					</svg>
				</button>
			</Show>

			<Preview
				isOpen={isPreviewOpen()}
				onClose={handlePreviewEnd}
				title={props.game.title}
				isFullscreen={isFullscreen()}
				onFullscreenChange={setIsFullscreen}
			>
				<div class="flex items-center justify-center h-full text-gray-400">
					<div class="animate-pulse">Loading game preview...</div>
				</div>
			</Preview>
		</Link>
	);
}
