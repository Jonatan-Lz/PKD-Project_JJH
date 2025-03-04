import { head, pair, tail } from "../lib/list.js";
//gets x-coordinate of object
export function get_x(object) {
    return head(object.gameObject.location);
}
//gets y-coordinate of object
export function get_y(object) {
    return tail(object.gameObject.location);
}
//move object to given coordinates
export function change_location(object, x, y) {
    object.gameObject.location = pair(x, y);
}
//get sprite of object
export function get_sprite(object) {
    return object.gameObject.sprite;
}
