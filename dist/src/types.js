import { head, pair, tail } from "../lib/list.js";
export const chunkSize = 100; // size of a chunk
//gets x-coordinate of object
export function get_x(object) {
    return head(object.gameObject.location);
}
//gets y-coordinate of object
export function get_y(object) {
    return tail(object.gameObject.location);
}
export function get_chunX(object) {
    return object.gameObject.chunkX;
}
//gets y-coordinate of object
export function get_chunkY(object) {
    return object.gameObject.chunkY;
}
//move object to given coordinates
export function change_location(object, x, y) {
    object.gameObject.location = pair(x, y);
}
//get sprite of object
export function get_sprite(object) {
    return object.gameObject.sprite;
}
export function createGameobject(x, y, radius, hp, sprite) {
    return { color: null, location: pair(x, y), hitbox: radius, rotAngle: 0, hp, sprite, chunkX: chunkX(x), chunkY: chunkY(y) };
}
export function chunkX(x) {
    return Math.floor(x / chunkSize);
}
export function chunkY(y) {
    return Math.floor(y / chunkSize);
}
