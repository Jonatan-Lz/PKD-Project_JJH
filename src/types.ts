import{ Pair, head, pair, tail } from "../lib/list.js"
type color = {red: number, green: number, blue: number, alpha: number};
type gameObject = {
color: null
location: Pair<number, number> //head is x coordinate, tail is y coordinate
hitbox: number  //the radius of the hitbox circle with object in center
rotaAngle: number //rotation angle counter-clockwise
hp: number //planets and bullet have hp = 1 or 0
sprite: string };
export type world = Array<Array<string>>;
export type ship = {tag: "ship", gameObject: gameObject, xVel: number, yVel: number}
export type turret = {tag: "turret", gameObject: gameObject}
export type bullet = {tag: "bullet", team: boolean, gameObject: gameObject, 
               xVel: number, yVel: number, lifeTime: number}
               //team true is friendly, false is enemy. lifeTime is ticks left until despawn
export type planet = {tag: "planet", gameObject: gameObject, radius: number}
export type generalObject = ship|planet|turret|bullet;

export function get_x(object: generalObject): number{
    return head(object.gameObject.location);
}

export function get_y(object: generalObject): number{
    return tail(object.gameObject.location);
}

export function change_location(object: generalObject, x: number, y: number): void{
    object.gameObject.location = pair(x, y);
}

export function get_sprite(object: generalObject): string{
    return object.gameObject.sprite
}