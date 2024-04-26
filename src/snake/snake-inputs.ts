import { Snake } from "./models";

export function registerKeyboardEvents(snake: Snake): void {
    window.addEventListener('keypress', (ev) => {
        switch (ev.key) {
            case 'a':
                snake.updateDirection(snake.direction - 0.25)
                break;
            case 'd':
                snake.updateDirection(snake.direction + 0.25)
                break;
        }
    })
    // window.addEventListener('keyup', (ev) => {
    //     switch (ev.key) {
    //         case 'a':
    //             break;
    //         case 'd':
    //             break;
    //     }
    // })
}