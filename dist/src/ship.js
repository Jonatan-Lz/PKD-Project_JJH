import { pair } from "../lib/list.js";
const accel = 0.5;
const deAccel = 0.1;
const maxVel = 0.2;
/**
 * Creates and returns a ship with given parameters:
 * @param hitboxRad hitbox radius
 * @param x x-coordinate of ship
 * @param y y-coordinate of ship
 * @param sprite sprite of ship
 * @param hp health of ship
 * @returns created ship
 */
export function createShip(hitboxRad, x, y, sprite, hp) {
    return { tag: "ship",
        gameObject: { color: null, location: pair(x, y), hitbox: hitboxRad,
            rotAngle: 0, hp: hp, sprite: sprite },
        xVel: 0, yVel: 0 };
}
