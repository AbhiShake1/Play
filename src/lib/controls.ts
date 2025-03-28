import { createEffect, createSignal, onMount } from "solid-js";
import { showToast } from "~/components/ui/toast";

export type Direction = "left" | "right" | "up" | "down";
interface ControlState {
	direction: Direction | null;
	isMoving: boolean;
}

export const KEY_MAPPINGS = {
	ArrowLeft: "left",
	ArrowRight: "right",
	ArrowUp: "up",
	ArrowDown: "down",
	h: "left",
	l: "right",
	k: "up",
	j: "down",
} as const;

export function createControls() {
	const [controlState, setControlState] = createSignal<ControlState>({
		direction: null,
		isMoving: false,
	});
	
	createEffect(() => {
		showToast({title: JSON.stringify(controlState())})
	}, [controlState])

	// Keyboard controls handler
	function handleKeyDown(event: KeyboardEvent) {
		const direction = KEY_MAPPINGS[event.key as keyof typeof KEY_MAPPINGS];

		if (direction) {
			event.preventDefault();
			setControlState({ direction, isMoving: true });
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (KEY_MAPPINGS[event.key as keyof typeof KEY_MAPPINGS]) {
			if (!controlState().isMoving)
				setControlState({ direction: null, isMoving: false });
		}
	}

	// Touch controls handler
	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;

	function handleTouchStart(event: TouchEvent) {
		const touch = event.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		touchStartTime = Date.now();
	}

	function handleTouchEnd(event: TouchEvent) {
		const touch = event.changedTouches[0];
		const touchEndX = touch.clientX;
		const touchEndY = touch.clientY;
		const touchEndTime = Date.now();

		// Calculate swipe distance and time
		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;
		const deltaTime = touchEndTime - touchStartTime;

		// Minimum swipe distance and maximum swipe time
		const minSwipeDistance = 50;
		const maxSwipeTime = 300;

		// Check if the touch event was a swipe
		if (deltaTime <= maxSwipeTime) {
			if (
				Math.abs(deltaX) > Math.abs(deltaY) &&
				Math.abs(deltaX) > minSwipeDistance
			) {
				// Horizontal swipe
				if (deltaX > 0) {
					setControlState({ direction: "right", isMoving: true });
				} else {
					setControlState({ direction: "left", isMoving: true });
				}
			} else if (Math.abs(deltaY) > minSwipeDistance) {
				// Vertical swipe
				if (deltaY > 0) {
					setControlState({ direction: "down", isMoving: true });
				} else {
					setControlState({ direction: "up", isMoving: true });
				}
			}
		}

		// Only reset control state if no swipe was detected
		// if (Math.abs(deltaX) <= minSwipeDistance && Math.abs(deltaY) <= minSwipeDistance) {
		// 	setControlState({ direction: null, isMoving: false });
		// }
	}

	// Gyroscope controls
	let gyroscopeAvailable = false;

	function handleDeviceOrientation(event: DeviceOrientationEvent) {
		if (!gyroscopeAvailable) return;

		const beta = event.beta; // Front/back tilt [-180, 180]
		const gamma = event.gamma; // Left/right tilt [-90, 90]

		if (beta === null || gamma === null) return;

		const tiltThreshold = 10;

		if (Math.abs(gamma) > Math.abs(beta)) {
			if (gamma < -tiltThreshold) {
				setControlState({ direction: "left", isMoving: true });
			} else if (gamma > tiltThreshold) {
				setControlState({ direction: "right", isMoving: true });
			}
		} else {
			if (beta < -tiltThreshold) {
				setControlState({ direction: "up", isMoving: true });
			} else if (beta > tiltThreshold) {
				setControlState({ direction: "down", isMoving: true });
			}
		}
	}

	onMount(() => {
		const abortController = new AbortController();
		// Set up keyboard listeners
		window.addEventListener("keydown", handleKeyDown, abortController);
		window.addEventListener("keyup", handleKeyUp, abortController);

		// Set up touch listeners
		window.addEventListener("touchstart", handleTouchStart, abortController);
		window.addEventListener("touchend", handleTouchEnd, abortController);

		// Check and set up gyroscope
		if (window.DeviceOrientationEvent) {
			window.addEventListener(
				"deviceorientation",
				handleDeviceOrientation,
				abortController,
			);
			gyroscopeAvailable = true;
		}

		() => {
			abortController.abort();
		};
	});

	return [controlState, setControlState] as const;
}
