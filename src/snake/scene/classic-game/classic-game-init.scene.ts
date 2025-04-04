import { GameAsset } from "core/assets-manager";
import { Snake, SnakeInitParam } from "../../models";

export const HIGHLIGHT_COLOR: string = "#1Aaa0A";
export const COLORS: string[] = [
  "#ffb3ba",
  "#ffdfba",
  "#ffffba",
  "#baffc9",
  "#bae1ff",
];
export const CLASSIC_GAME_ASSETS: GameAsset[] = [
  { id: "rat", path: "assets/images/cookie.webp", type: "IMAGE" },
  { id: "snake-start", path: "assets/audio/snake-start.mp3", type: "AUDIO" },
  { id: "snake-death", path: "assets/audio/snake-death.mp3", type: "AUDIO" },
  { id: "snake-eat", path: "assets/audio/snake-eat.mp3", type: "AUDIO" },
];

export function initSnake(
  ctx: CanvasRenderingContext2D,
  options?: SnakeInitParam,
): Snake {
  const snake = new Snake(ctx, "player");
  snake.init(options ?? {});
  return snake;
}
