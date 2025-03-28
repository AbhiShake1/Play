import type { FileRoutesByTo } from "~/routeTree.gen";

export interface Game {
  id: number;
  title: string;
  category: string;
  url: keyof FileRoutesByTo;
}

export const games: Game[] = [
  {
    id: 1,
    title: 'Snake Classic',
    category: 'Arcade',
    url: '/snake'
  },
];