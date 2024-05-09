import { Snake } from "../../models";

export function registerKeyboardEvents(snake: Snake): void {
    window.addEventListener('keydown', (ev) => {
        switch (ev.key) {
            case 'a':
                snake.steer(- 0.25) // TODO: send SteerDirection
                break;
            case 'd':
                snake.steer(+ 0.25) // TODO: send SteerDirection
                break;
            case ' ':
                snake.setTurbo(true);
                break;
        }
    })
    window.addEventListener('keyup', (ev) => {
        switch (ev.key) {
            case ' ':
                snake.setTurbo(false);
                break;
        }
    })
}

export function registerMouseEvents(snake: Snake) {
    window.addEventListener('mousemove', (ev: MouseEvent) => {
        snake.steerTo({ x: ev.x, y: ev.y });
    })
}