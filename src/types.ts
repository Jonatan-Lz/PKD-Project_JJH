import{ Pair, head, pair, tail, List } from "../lib/list.js"

//A world is defined as a 2-dimensional array with each index as a letter, to signal what is there.
export type world = Array<Array<string>>;
type gameObject = {
    color: null
    location: Pair<number, number> //head is x coordinate, tail is y coordinate
    hitbox: number  //the radius of the hitbox circle with object in center
    rotAngle: number //rotation angle counter-clockwise
    hp: number //planets and bullet have hp = 1 or 0
    sprite: string 
};
export type ship = {tag: "ship", gameObject: gameObject, xVel: number, yVel: number}
export type turret = {tag: "turret", gameObject: gameObject}
export type bullet = {tag: "bullet", team: boolean, gameObject: gameObject, 
               xVel: number, yVel: number, lifeTime: number}
               //team true is friendly, false is enemy. lifeTime is ticks left until despawn
export type planet = {tag: "planet", gameObject: gameObject, radius: number, turrets: List<turret | null>}
export type generalObject = ship|planet|turret|bullet;

//gets x-coordinate of object
export function get_x(object: generalObject): number{
    return head(object.gameObject.location);
}

//gets y-coordinate of object
export function get_y(object: generalObject): number{
    return tail(object.gameObject.location);
}

//move object to given coordinates
export function change_location(object: generalObject, x: number, y: number): void{
    object.gameObject.location = pair(x, y);
}

//get sprite of object
export function get_sprite(object: generalObject): string{
    return object.gameObject.sprite
}
