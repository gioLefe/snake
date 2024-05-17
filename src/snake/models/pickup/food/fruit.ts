import { Food } from "../../food";

export class Fruit extends Food {
    constructor(id: string) {
        super(id)
    }
    onPickup(...args: any): void {
        // TODO Play sound, disapear animation, etc.
    }
}