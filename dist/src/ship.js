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
/**
 * Changes velocity of ship based on input
 * @param dir the direction "a" = left, "d" = right
 *            "w" = upp, "s" = down, "r" = slow down
 * @param ship the ship
 */
export function movement(dir, ship) {
    let xVel = ship.xVel;
    let yVel = ship.yVel;
    switch (dir) {
        case "a":
            xVel = xVel - accel;
            changeMovement();
            break;
        case "d":
            xVel = xVel + accel;
            changeMovement();
            break;
        case "w":
            yVel = yVel - accel;
            changeMovement();
            break;
        case "s":
            yVel = yVel + accel;
            changeMovement();
            break;
        case "r":
            if (Math.abs(yVel) < 0.1) {
                yVel = 0;
            }
            else {
                yVel -= (yVel / Math.abs(yVel)) * deAccel;
            }
            if (Math.abs(xVel) < 0.1) {
                xVel = 0;
            }
            else {
                xVel -= (xVel / Math.abs(xVel)) * deAccel;
            }
            ship.xVel = xVel;
            ship.yVel = yVel;
            break;
    }
    function changeMovement() {
        let combinedVel = Math.sqrt(Math.pow(xVel, 2) + Math.pow(yVel, 2));
        if (combinedVel > maxVel) {
            combinedVel = Math.sqrt(combinedVel);
            ship.xVel = xVel / combinedVel;
            ship.yVel = yVel / combinedVel;
        }
        else {
            ship.xVel = xVel;
            ship.yVel = yVel;
        }
    }
}
