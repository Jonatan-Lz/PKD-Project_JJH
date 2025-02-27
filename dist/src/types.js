import { head, pair, tail } from "../lib/list.js";
export function get_x(object) {
    return head(object.gameObject.location);
}
export function change_x(object, x) {
    return head(object.gameObject.location);
}
export function get_y(object) {
    return tail(object.gameObject.location);
}
export function change_location(object, x, y) {
    object.gameObject.location = pair(x, y);
}
export function get_sprite(object) {
    return object.gameObject.sprite;
}
