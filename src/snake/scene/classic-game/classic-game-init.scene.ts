import { GameAsset } from "../../../core/models/game-asset";
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
  // IMAGES
  { id: "cookie", path: "assets/images/pomodoro.webp", type: "IMAGE" },
  { id: "bg-tile-1", path: "assets/images/bg-tile-1.webp", type: "IMAGE" },
  { id: "bg-tile-2", path: "assets/images/bg-tile-2.webp", type: "IMAGE" },
  { id: "bg-tile-3", path: "assets/images/bg-tile-3.webp", type: "IMAGE" },
  { id: "snake-face", path: "assets/images/snake-face.png", type: "IMAGE" },
  { id: "speaker-up", path: "assets/images/speaker-up.png", type: "IMAGE" },
  { id: "speaker-mute", path: "assets/images/speaker-mute.png", type: "IMAGE" },

  // SOUNDS
  { id: "snake-start", path: "assets/audio/snake-start.mp3", type: "AUDIO" },
  { id: "snake-death", path: "assets/audio/snake-death.mp3", type: "AUDIO" },
  { id: "snake-eat", path: "assets/audio/snake-eat.mp3", type: "AUDIO" },
  { id: "background-music", path: "assets/audio/super-polka.ogg", type: "AUDIO" },
];

export function initSnake(
  ctx: CanvasRenderingContext2D,
  options?: SnakeInitParam,
): Snake {
  const snake = new Snake(ctx, "player");
  snake.init(options ?? {});
  return snake;
}
