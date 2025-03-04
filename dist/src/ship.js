import { createGameobject } from "./types.js";
const accel = 0.1;
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
        gameObject: createGameobject(x, y, 0.5, 100, "A"),
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
            if (Math.abs(ship.xVel) < 0.05) {
                ship.xVel = 0;
            }
            if (Math.abs(ship.yVel) < 0.05) {
                ship.yVel = 0;
            }
        }
        else {
            ship.xVel = xVel;
            ship.yVel = yVel;
        }
    }
}
//checks velocity and changes ship sprite depending on it
//(this function looks so incredibly bad)
//((how the fuck do i make switch cases with two variables????))
export function ship_rotation_sprite(ship) {
    const xVel = ship.xVel;
    const yVel = ship.yVel;
    let sprite = "";
    if (xVel > 0) {
        if (yVel > 0) {
            sprite = "&seArr;";
        }
        else if (yVel < 0) {
            sprite = "&neArr;";
        }
        else if (yVel === 0) {
            sprite = "&rArr;";
        }
        else { }
    }
    else if (xVel < 0) {
        if (yVel > 0) {
            sprite = "&swArr;";
        }
        else if (yVel < 0) {
            sprite = "&nwArr;";
        }
        else if (yVel === 0) {
            sprite = "&lArr;";
        }
        else { }
    }
    else if (xVel === 0) {
        if (yVel > 0) {
            sprite = "&dArr;";
        }
        else if (yVel < 0) {
            sprite = "&uArr;";
        }
        else if (xVel === 0) {
            sprite = "&star;";
        }
        else { }
    }
    ship.gameObject.sprite = sprite;
}
