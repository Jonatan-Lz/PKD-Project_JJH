import { chunkSize, gameObject, generalObject} from "./types.js";
import { head, is_null, List, pair, tail } from "../lib/list.js"
/**
 * Checks collision between two objects
 * @param object1 The first object
 * @param object2 The second object
 * @returns True if colliding, False otherwise
 */
export function collision(object1: generalObject, object2: generalObject): boolean {
    //Checks if the distance between the objects is smaller/equal to their combined hitbox radius
    //(Checks if the object are colliding)
    return (Math.sqrt((get_x(object1) - get_x(object2))**2 + (get_y(object1) - get_y(object2))**2)
            <= object2.gameObject.hitbox + object1.gameObject.hitbox);
}

/**
 * Checks collision between two objects
 * @param object1 The first object
 * @param object2 The second object
 * @param minDist the minimum distance
 * @returns True if colliding, False otherwise
 */
export function minDistCollision(object1: generalObject, object2: generalObject, minDist: number): boolean {
    //Checks if the distance between the objects is smaller/equal to their combined hitbox radius
    //(Checks if the object are colliding)
    return (Math.sqrt((get_x(object1) - get_x(object2))**2 + (get_y(object1) - get_y(object2))**2)
            <= object2.gameObject.hitbox + object1.gameObject.hitbox + minDist);
}


/**
 * Checks collision between the main object and every object in the list
 * @param mainObject The main object
 * @param objectList The list of objects
 * @returns The object it collided with
 */
export function collisionForEach(mainObject: generalObject, objectList: List<generalObject>): generalObject | null {
    let newObjectList = objectList;
    let index = 0;
    while(!is_null(newObjectList)){
        const secondaryObject = head(newObjectList);
                if(collision(mainObject, secondaryObject)){
                    return secondaryObject;
                }
        index++;
        newObjectList = tail(newObjectList);
    }
    return null;
}

/**
 * Checks collision between the main object and every object in the list
 * @param mainObject The main object
 * @param objectList The list of objects
 * @param minDist The minimum  distance between the objects
 * @returns The object it collided with
 */
export function minDistCollisionForEach(mainObject: generalObject, objectList: List<generalObject>, minDist: number): number {
    let newObjectList = objectList;
    let index = 0;
    while(!is_null(newObjectList)){
        const secondaryObject = head(newObjectList);
                if(minDistCollision(mainObject, secondaryObject, minDist)){
                    return index;
                }
        index++;
        newObjectList = tail(newObjectList);
    }
    return -1;
}

//gets x-coordinate of object
export function get_x(object: generalObject): number{
    return head(object.gameObject.location);
}

//gets y-coordinate of object
export function get_y(object: generalObject): number{
    return tail(object.gameObject.location);
}

//gets x-coordinate of object
export function get_hp(object: generalObject): number{
    return object.gameObject.hp;
}

//move object to given coordinates
export function change_location(object: generalObject, x: number, y: number): void{
    object.gameObject.location = pair(x, y);
}

//get sprite of object
export function get_sprite(object: generalObject): string{
    return object.gameObject.sprite
} 

//get an objects x - coordinate of chunk
export function get_chunkX(object: generalObject): number{
    return object.gameObject.chunkX;
}

//get an objects y - coordinate of chunk
export function get_chunkY(object: generalObject): number{
    return object.gameObject.chunkY;
}

/**
 * Creates and returns a gameObject with given parameters
 * @param x x - coordinate
 * @param y y - coordinate
 * @param radius radius
 * @param hp health
 * @param sprite sprite
 * @returns {gameObject} a gameObject
 */
export function createGameobject(x: number, y:number, radius: number, hp: number, sprite: string): gameObject{
    return {color: null, location: pair(x, y), hitbox: radius, rotAngle: 0, hp, sprite, chunkX: calc_chunkX(x), chunkY: calc_chunkY(y)}
}

//returns the x-coordinate of a chunk, with given x-coordinate
export function calc_chunkX(x: number): number{
    return Math.floor(x/chunkSize);
}

//returns the y-coordinate of a chunk, with given y-coordinate
export function calc_chunkY(y: number): number{
    return Math.floor(y/chunkSize);
}
