import { ship } from "./types.js";
import { pair } from "../lib/list.js";

/**
 * Creates and returns a ship with given parameters:
 * @param hitboxRad hitbox radius
 * @param x x-coordinate of ship
 * @param y y-coordinate of ship
 * @param sprite sprite of ship
 * @param hp health of ship
 * @returns created ship
 */
export function createShip(hitboxRad: number, x: number, y: number, sprite: string, hp: number): ship{
    return {tag: "ship", 
            gameObject: 
                {color: null, location: pair(x, y), hitbox: hitboxRad, 
                rotAngle: 0, hp: hp, sprite: sprite},
                xVel: 0, yVel: 0};
}