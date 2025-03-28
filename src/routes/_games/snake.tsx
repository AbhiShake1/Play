import { createFileRoute } from "@tanstack/solid-router";
import {
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { GameOverDialog } from "../../components/ui/game-over-dialog";
import { createControls } from "../../lib/controls";

type Position = { x: number; y: number };

export const Route = createFileRoute("/_games/snake")({
	component: RouteComponent,
});

function RouteComponent() {
	const MIN_CELL_SIZE = 15;
	const MAX_CELL_SIZE = 25;
	const TARGET_GRID_SIZE = 20;
	const [gridSize, setGridSize] = createSignal(TARGET_GRID_SIZE);
	const [cellSize, setCellSize] = createSignal(20);

	const calculateDimensions = () => {
		const container = document.querySelector('.game-container');
		if (!container) return;

		let containerWidth = container.clientWidth;
		let containerHeight = container.clientHeight;
		
		// swap
		if (containerWidth < containerHeight) {
			containerWidth += containerHeight
			containerHeight = containerWidth - containerHeight
			containerWidth = containerWidth - containerHeight
		}

		// Calculate cell size based on container dimensions
		const maxCellsX = Math.floor(containerWidth / MIN_CELL_SIZE);
		const maxCellsY = Math.floor(containerHeight / MIN_CELL_SIZE);
		const newGridSize = Math.min(maxCellsX, maxCellsY, TARGET_GRID_SIZE);

		// Calculate cell size to fill container while maintaining aspect ratio
		const newCellSize = Math.min(
			Math.floor(containerWidth / newGridSize),
			Math.floor(containerHeight / newGridSize),
			MAX_CELL_SIZE
		);

		setGridSize(newGridSize);
		setCellSize(newCellSize);
	};
	const INITIAL_SPEED = 150;
	const SPEED_INCREMENT = 0.95;
	const INITIAL_SNAKE = [{ x: 10, y: 10 }];
	const SCORE_MULTIPLIER_THRESHOLD = 1000; // Time in ms to maintain multiplier

	const [snake, setSnake] = createSignal(INITIAL_SNAKE);
	const [food, setFood] = createSignal<Position>({ x: 15, y: 10 });
	const [gameOver, setGameOver] = createSignal(false);
	const [score, setScore] = createSignal(0);
	const [speed, setSpeed] = createSignal(INITIAL_SPEED);
	const [multiplier, setMultiplier] = createSignal(1);
	const [lastFoodTime, setLastFoodTime] = createSignal(Date.now());
	const [obstacles, setObstacles] = createSignal<Position[]>([]);
	const [isColliding, setIsColliding] = createSignal(false);

	let gameLoop: number;

	const [_direction, setDirection] = createControls();

	const direction = createMemo(() => _direction().direction ?? "right");

	const generateFood = () => {
		let newFood!: { x: number; y: number };
		const currentSnake = snake();
		const currentObstacles = obstacles();

		do {
			newFood = {
				x: Math.floor(Math.random() * gridSize()),
				y: Math.floor(Math.random() * gridSize()),
			};
		} while (
			currentSnake.some(
				(segment) => segment.x === newFood.x && segment.y === newFood.y,
			) ||
			currentObstacles.some(
				(obstacle) => obstacle.x === newFood.x && obstacle.y === newFood.y
			)
		);

		setFood(newFood);
	};

	const checkCollision = (head: Position) => {
		// Wall collision
		if (
			head.x < 0 ||
			head.x >= gridSize() ||
			head.y < 0 ||
			head.y >= gridSize()
		) {
			setIsColliding(true);
			return true;
		}
		// Self collision and obstacle collision
		const selfCollision = snake()
			.slice(1)
			.some((segment) => segment.x === head.x && segment.y === head.y);
		
		const obstacleCollision = obstacles().some(
			(obstacle) => obstacle.x === head.x && obstacle.y === head.y
		);

		if (selfCollision || obstacleCollision) {
			setIsColliding(true);
			return true;
		}

		return false;
	};

	const moveSnake = () => {
		if (gameOver()) return;

		const currentSnake = snake();
		const head = currentSnake[0];
		let newHead!: Position;

		switch (direction()) {
			case "up":
				newHead = { x: head.x, y: head.y - 1 };
				break;
			case "down":
				newHead = { x: head.x, y: head.y + 1 };
				break;
			case "left":
				newHead = { x: head.x - 1, y: head.y };
				break;
			case "right":
				newHead = { x: head.x + 1, y: head.y };
				break;
		}

		if (checkCollision(newHead)) {
			setGameOver(true);
			if (gameLoop) clearInterval(gameLoop);
			return;
		}

		const newSnake = [newHead, ...currentSnake];
		const currentFood = food();

		if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
			const now = Date.now();
			const timeSinceLastFood = now - lastFoodTime();
			
			// Update multiplier based on quick successive catches
			if (timeSinceLastFood < SCORE_MULTIPLIER_THRESHOLD) {
				setMultiplier(prev => Math.min(prev + 0.5, 4));
			} else {
				setMultiplier(1);
			}

			setScore(prev => prev + Math.floor(1 * multiplier()));
			setSpeed(prev => prev * SPEED_INCREMENT);
			setLastFoodTime(now);

			// Add obstacles as score increases
			if (score() > 0 && score() % 5 === 0) {
				const newObstacle = {
					x: Math.floor(Math.random() * gridSize()),
					y: Math.floor(Math.random() * gridSize())
				};
				setObstacles(prev => [...prev, newObstacle]);
			}

			generateFood();
		} else {
			newSnake.pop();
		}

		setSnake(newSnake);
	};

	const startGame = () => {
		setSnake(INITIAL_SNAKE);
		setDirection({ direction: "right", isMoving: true });
		setScore(0);
		setSpeed(INITIAL_SPEED);
		setGameOver(false);
		setMultiplier(1);
		setLastFoodTime(Date.now());
		setObstacles([]);
		setIsColliding(false);
		generateFood();

		if (gameLoop) clearInterval(gameLoop);
		gameLoop = setInterval(moveSnake, speed());
	};

	onMount(() => {
		calculateDimensions();
		startGame();

		const interval = setInterval(() => setDirection(_direction()), 50);
		const resizeObserver = new ResizeObserver(() => calculateDimensions());
		const container = document.querySelector('.game-container');
		if (container) resizeObserver.observe(container);

		onCleanup(() => {
			clearInterval(interval);
			resizeObserver.disconnect();
		});
	});

	onCleanup(() => {
		if (gameLoop) clearInterval(gameLoop);
	});

	return (
		<div class="flex flex-col items-center justify-center h-[80vh] bg-[#0a0c0f] text-white">
			<div class="mb-4 space-y-2 text-center">
				<div class="text-2xl font-bold">Score: {score()}</div>
				{isColliding() && (
					<Button
						onClick={startGame}
					>
						Restart Game
					</Button>
				)}
			</div>
			<div
				class="aspect-square game-container relative border-2 border-orange-500/50 rounded-lg overflow-hidden bg-[#0f1214] before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#1a1f2340_2px,#1a1f2340_4px)] before:opacity-20 before:animate-[grass-pattern_20s_linear_infinite] after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#0f1214_100%)] after:opacity-50 shadow-[inset_0_0_50px_rgba(0,0,0,0.5),0_0_30px_rgba(255,69,0,0.2)] w-[min(65vh,400px)] h-[min(65vh,400px)]"
			>
				{/* Render obstacles */}
				{obstacles().map((obstacle) => (
					<div
						class="absolute bg-red-500/30 rounded-md border-2 border-red-500/50"
						style={{
							width: `${cellSize()}px`,
							height: `${cellSize()}px`,
							left: `${obstacle.x * cellSize()}px`,
							top: `${obstacle.y * cellSize()}px`,
						}}
					/>
				))}

				{/* Render snake */}
				{snake().map((segment, index) => (
					<div
						class={cn("absolute transition-all duration-150", 
							"animate-[snake-pattern_3s_linear_infinite]",
							{
						"animate-[shake_0.5s_ease-in-out]":isColliding() && index === 0,
							"rounded-[40%] bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 bg-[length:200%_100%] scale-110":
								index === 0,
							"rounded-[45%] bg-gradient-to-br from-green-600 via-green-400 to-red-400 bg-[length:200%_100%] scale-105":
								index === 1,
							"rounded-[45%] bg-gradient-to-br from-green-500 via-green-300 to-red-300 bg-[length:200%_100%] scale-100":
								index > 1 && index < snake().length - 1,
							"rounded-[45%] bg-gradient-to-br from-green-400 via-green-200 to-red-200 bg-[length:200%_100%] scale-95":
								index === snake().length - 1,
							"shadow-[0_0_15px] shadow-orange-500/40 animate-[snake-pulse_2s_ease-in-out_infinite]":
								index === 0,
							"shadow-[0_0_12px] shadow-green-500/30": index === 1,
							"shadow-[0_0_8px] shadow-green-400/20": index > 1,
							"rotate-270": direction() === "up",
							"rotate-90": direction() === "down",
							"rotate-180": direction() === "left",
						})}
						style={{
							width: `${cellSize() * 1.2}px`,
							height: `${cellSize() * 1.2}px`,
							left: `${segment.x * cellSize() - cellSize() * 0.1}px`,
							top: `${segment.y * cellSize() - cellSize() * 0.1}px`,
							"z-index": snake().length - index,
							transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
							filter: `brightness(${1 - index * 0.02}) saturate(${1.2 - index * 0.05})`,
						}}
					>
						{index === 0 && (
							<div class="relative w-full h-full animate-[snake-pulse_2s_ease-in-out_infinite]">
								<div class="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full shadow-inner" />
								<div class="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full shadow-inner" />
								<div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4 h-3 rotate-90">
									<div class="absolute left-0 w-[45%] h-[2px] bg-red-600 origin-right animate-[tongue-flick_0.5s_ease-in-out_infinite] rotate-[20deg]" />
									<div class="absolute right-0 w-[45%] h-[2px] bg-red-600 origin-left animate-[tongue-flick_0.5s_ease-in-out_infinite] -rotate-[20deg]" />
								</div>
							</div>
						)}
					</div>
				))}
				<div
					class="absolute flex items-center justify-center text-sm"
					style={{
						width: `${cellSize() - 4}px`,
						height: `${cellSize() - 4}px`,
						left: `${food().x * cellSize() + 2}px`,
						top: `${food().y * cellSize() + 2}px`,
					}}
				>
					🐁
				</div>
			</div>

			<GameOverDialog
				isOpen={gameOver()}
				onClose={() => setGameOver(false)}
				onRestart={startGame}
				score={score()}
				title="Game Over!"
				message="Can you beat your high score?"
				downloadEnabled={true}
				gameName="Snake"
			/>
		</div>
	);
}
