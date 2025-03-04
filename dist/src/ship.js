import { createGameobject, get_x, get_y } from "./generalFunction.js";
import { drawString } from "./drawScreen.js";
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
 *            "w" = up, "s" = down, "r" = slow down
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
/**
 * Draws a line from the ship to show where its aiming
 * @param keys currently pressed down keys
 * @param ship ship thats gonna aim
 * @param world world to draw the aim on
 */
export function aim_ship(keys, ship, world) {
    const ship_x = get_x(ship);
    const ship_y = get_y(ship);
    let print_x = 0;
    let print_y = 0;
    let y_direction = 0;
    let x_direction = 0;
    if (keys.up) {
        y_direction = 1;
    }
    else if (keys.left) {
        x_direction = -1;
    }
    else if (keys.down) {
        y_direction = -1;
    }
    else if (keys.right) {
        x_direction = 1;
    }
    else if (keys.up && keys.left) {
        y_direction = 1;
        x_direction = -1;
    }
    else if (keys.left && keys.down) {
        y_direction = -1;
        x_direction = -1;
    }
    else if (keys.down && keys.right) {
        y_direction = -1;
        x_direction = 1;
    }
    else if (keys.right && keys.up) {
        y_direction = 1;
        x_direction = 1;
    }
    else { }
    for (let i = 1; i < 5; i = i + 1) {
        print_x = ship_x + i * x_direction;
        print_y = ship_y + i * y_direction;
        if (print_x > 0 && print_x < world[0].length && print_y > 0 && print_y < world.length) {
            drawString(world, print_x, print_y, "*");
        }
    }
}
