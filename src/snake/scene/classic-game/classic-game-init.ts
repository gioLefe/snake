import { Snake, SnakeInitParam } from "../../models";

export const highlightColor: string = "#1Aaa0A";
export const colors: string[] = [
    "#ffb3ba",
    "#ffdfba",
    "#ffffba",
    "#baffc9",
    "#bae1ff",
];

export function initSnake(ctx: CanvasRenderingContext2D, options?: SnakeInitParam): Snake {
    const snake = new Snake('player');
    snake.init(ctx, options ?? {})
    return snake;
}
