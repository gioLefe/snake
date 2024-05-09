import { PickupItem } from "./";

export class Food extends PickupItem {
    constructor(id: string) {
        super();
        this.id = id;
    }
    id: string;
    value = 1;
}