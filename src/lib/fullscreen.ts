import { createSignal } from "solid-js";

export function createFullscreen() {
	const [isFullscreen, setIsFullscreen] = createSignal(
		localStorage.getItem("isFullscreen") === "true",
	);

	const toggleFullscreen = ({ saveToLocal = true } = {}) => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			setIsFullscreen(true);
			if (saveToLocal) localStorage.setItem("isFullscreen", "true");
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
			if (saveToLocal) localStorage.setItem("isFullscreen", "false");
		}
	};

	return [isFullscreen, setIsFullscreen, toggleFullscreen] as const;
}
