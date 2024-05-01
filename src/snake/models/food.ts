
export interface Pickup {
    id: string,
}

export class Food implements Pickup {
    id: string = '';
    value = 1;
    radius = 2;

    constructor(id: string) {
        this.id = id
    }
}