import { get_x, get_y } from "./types.js";
import { head, is_null, tail } from "../lib/list.js";
/**
 * Checks collision between two objects
 * @param object1 The first object
 * @param object2 The second object
 * @returns True if colliding, False otherwise
 */
export function collision(object1, object2) {
    //Checks if the distance between the objects is smaller/equal to their combined hitbox radius
    //(Checks if the object are colliding)
    return (Math.sqrt(Math.pow((get_x(object1) - get_x(object2)), 2) + Math.pow((get_y(object1) - get_y(object2)), 2))
        <= object2.gameObject.hitbox + object1.gameObject.hitbox);
}
/**
 * Checks collision between the main object and every object in the list
 * @param mainObject The main object
 * @param objectList The list of objects
 * @returns The index of the first collision otherwise returns -1
 */
export function collisionForEach(mainObject, objectList) {
    let newObjectList = objectList;
    let index = 0;
    while (!is_null(newObjectList)) {
        const secondaryObject = head(newObjectList);
        if (collision(mainObject, secondaryObject)) {
            return index;
        }
        index++;
        newObjectList = tail(newObjectList);
    }
    return -1;
}
