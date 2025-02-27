import { get_x, get_y } from "./types.js";
export function collision(object1, object2) {
    //Checks if the distance between the objects is smaller/equal to their combined hitbox radius
    //(Checks if the object are colliding)
    return (Math.sqrt(Math.pow((get_x(object1) - get_x(object2)), 2) + Math.pow((get_y(object1) - get_y(object2)), 2))
        <= object2.gameObject.hitbox + object1.gameObject.hitbox);
}
