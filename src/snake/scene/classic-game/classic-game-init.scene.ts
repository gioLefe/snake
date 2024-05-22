import { Snake, SnakeInitParam } from "../../models";

export const HIGHLIGHT_COLOR: string = "#1Aaa0A";
export const COLORS: string[] = [
    "#ffb3ba",
    "#ffdfba",
    "#ffffba",
    "#baffc9",
    "#bae1ff",
];
export const CLASSIC_GAME_IMAGE_ASSETS: { id: string, path: string }[] = [
    { id: 'rat', path: '/images/spritesheets/rat.png' }
]

export function initSnake(ctx: CanvasRenderingContext2D, options?: SnakeInitParam): Snake {
    const snake = new Snake('player');
    snake.init(ctx, options ?? {})
    return snake;
}
