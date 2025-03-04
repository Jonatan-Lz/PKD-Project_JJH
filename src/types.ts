import{ List, Pair, head, pair, tail } from "../lib/list.js"

//A world is defined as a 2-dimensional array with each index as a letter, to signal what is there.
export type world = Array<Array<string>>;
type gameObject = {
    color: null
    location: Pair<number, number> //head is x coordinate, tail is y coordinate
    hitbox: number  //the radius of the hitbox circle with object in center
    rotAngle: number //rotation angle counter-clockwise
    hp: number //planets and bullet have hp = 1 or 0
    sprite: string 
    chunkX: number
    chunkY: number
};
export type chunks = {[key: string]: chunk}; // refer to a specific chunk by "x,y"
export type chunk = {planets: List<planet>, bullets: List<bullet>, turrets: List<turret>};
export type ship = {tag: "ship", gameObject: gameObject, xVel: number, yVel: number};
export type turret = {tag: "turret", gameObject: gameObject};
export type bullet = {tag: "bullet", team: boolean, gameObject: gameObject, 
               xVel: number, yVel: number, lifeTime: number};
               //team true is friendly, false is enemy. lifeTime is ticks left until despawn
export type planet = {tag: "planet", gameObject: gameObject, radius: number};
export type generalObject = ship|planet|turret|bullet;
export type keys_pressed = {w: Boolean, a: Boolean, s: Boolean, d: Boolean, r: Boolean,
                            left: Boolean, up: Boolean, right: Boolean, down: Boolean};

export const chunkSize: number = 100; // size of a chunk

//gets x-coordinate of object
export function get_x(object: generalObject): number{
    return head(object.gameObject.location);
}

//gets y-coordinate of object
export function get_y(object: generalObject): number{
    return tail(object.gameObject.location);
}

export function get_chunX(object: generalObject): number{
    return object.gameObject.chunkX;
}

//gets y-coordinate of object
export function get_chunkY(object: generalObject): number{
    return object.gameObject.chunkY;
}

//move object to given coordinates
export function change_location(object: generalObject, x: number, y: number): void{
    object.gameObject.location = pair(x, y);

}

//get sprite of object
export function get_sprite(object: generalObject): string{
    return object.gameObject.sprite
}

export function createGameobject(x: number, y:number, radius: number, hp: number, sprite: string): gameObject{
    return {color: null, location: pair(x, y), hitbox: radius, rotAngle: 0, hp, sprite, chunkX: chunkX(x), chunkY: chunkY(y)}
}

export function chunkX(x: number): number{
    return Math.floor(x/chunkSize);
}

export function chunkY(y: number): number{
    return Math.floor(y/chunkSize);
}
