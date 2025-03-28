import { createSignal, onMount } from "solid-js";

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

	// Keyboard controls handler
	function handleKeyDown(event: KeyboardEvent) {
		const direction = KEY_MAPPINGS[event.key as keyof typeof KEY_MAPPINGS];
		if (direction) {
			event.preventDefault();
			event.stopPropagation();
    }

		if (direction) {
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
	function handleTouchStart(event: TouchEvent) {
		const touch = event.touches[0];
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		const x = touch.clientX;
		const y = touch.clientY;

		// Divide screen into zones
		if (x < screenWidth / 3) {
			setControlState({ direction: "left", isMoving: true });
		} else if (x > (screenWidth * 2) / 3) {
			setControlState({ direction: "right", isMoving: true });
		} else if (y < screenHeight / 2) {
			setControlState({ direction: "up", isMoving: true });
		} else {
			setControlState({ direction: "down", isMoving: true });
		}
	}

	function handleTouchEnd() {
		// if (scheme === 'touch') {
		//   setControlState({ direction: null, isMoving: false });
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
			window.addEventListener("deviceorientation", handleDeviceOrientation, abortController);
			gyroscopeAvailable = true;
		}
    
    () => {
      abortController.abort();
    }
	});

	return [controlState, setControlState] as const;
}
