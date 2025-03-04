import{ List, Pair, head, pair, tail } from "../lib/list.js"

//A world is defined as a 2-dimensional array with each index as a letter, to signal what is there.
export type screen = Array<Array<string>>;
export type gameObject = {
    color: null
    location: Pair<number, number> //head is x coordinate, tail is y coordinate
    hitbox: number  //the radius of the hitbox circle with object in center
    rotAngle: number //rotation angle counter-clockwise
    hp: number //planets and bullet have hp = 1 or 0
    sprite: string 
    chunkX: number
    chunkY: number
};
export type world = {[key: string]: chunk}; // refer to a specific chunk by "x,y"
export type chunk = {planets: List<planet>, bullets: List<bullet>, turrets: List<turret>};
export type ship = {tag: "ship", gameObject: gameObject, xVel: number, yVel: number};
export type turret = {tag: "turret", gameObject: gameObject};
export type bullet = {tag: "bullet", team: boolean, gameObject: gameObject, 
               xVel: number, yVel: number, lifeTime: number};
               //team true is friendly, false is enemy. lifeTime is ticks left until despawn
export type planet = {tag: "planet", gameObject: gameObject, radius: number, turrets: List<turret | null>};
export type generalObject = ship|planet|turret|bullet;
export type keys_pressed = {w: Boolean, a: Boolean, s: Boolean, d: Boolean, r: Boolean,
                            left: Boolean, up: Boolean, right: Boolean, down: Boolean};

export const chunkSize: number = 100; // size of a chunk
