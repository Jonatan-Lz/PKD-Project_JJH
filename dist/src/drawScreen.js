import { is_null, head, tail } from "../lib/list.js";
import { get_x, get_y, get_sprite } from "./generalFunction.js";
/**
 * Creates and returns an empty world
 * @returns an empty world
 */
export function createScreen(width, height) {
    let screen = [[]];
    let b = [];
    for (let x = 0; x < width; x++) {
        b.push("_");
    }
    screen[0] = b;
    for (let y = 1; y < height; y++) {
        b = [];
        for (let x = 0; x < width; x++) {
            b.push("_");
        }
        screen.push(b);
    }
    return screen;
}
//clears the screen (turns each index to "_")
function clearScreen(screen) {
    for (let y = 0; y < screen.length; y++) {
        for (let x = 0; x < screen[y].length; x++) {
            screen[y][x] = "_";
        }
    }
}
/**
 * Turns a world into a string to be drawn on the website.
 * @param screen - world to turn to string
 * @returns the world in string format
 */
export function printer(screen) {
    let screenString = "";
    for (let y = 0; y < screen.length; y++) {
        for (let x = 0; x < screen[y].length; x++) {
            screenString = screenString + " " + screen[y][x];
        }
        screenString = screenString + "<br>";
    }
    return screenString;
}
/**
 * Draws a circle in a given world
 * @param screen world to draw on
 * @param radius radius of the planet
 * @param x x-coordinate of the planet center
 * @param y y-coordinate of the planet center
 * @param sprite graphics for the planet
 */
function drawCircle(screen, radius, x, y, sprite) {
    for (let y1 = 0; y1 < screen.length; y1++) {
        for (let x1 = 0; x1 < screen[y1].length; x1++) {
            if (Math.sqrt((Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2))) <= radius) {
                screen[y1][x1] = sprite;
            }
        }
    }
}
//writes the sprite on designated coordinates, on given world.
export function drawString(screen, x, y, sprite) {
    if (screen[Math.floor(y)] != undefined && screen[Math.floor(y)][Math.floor(x)] != undefined) {
        screen[Math.floor(y)][Math.floor(x)] = sprite;
    }
}
/**
 * Redraws the world based on the parameters given
 * @param screen world to draw
 * @param planetList planets to put on the world
 * @param ship the ship
 */
export function drawScreen(screen, planetList, bulletList, ship) {
    const halfWidth = Math.floor(screen[0].length / 2);
    const halfHeight = Math.floor(screen.length / 2);
    let ship_x = get_x(ship);
    let ship_y = get_y(ship);
    clearScreen(screen);
    let newPlanetList = planetList;
    let newBulletList = bulletList;
    while (!is_null(newPlanetList)) {
        const planet = head(newPlanetList);
        drawCircle(screen, planet.radius, get_x(planet) + halfWidth - ship_x, get_y(planet) + halfHeight - ship_y, get_sprite(planet));
        newPlanetList = tail(newPlanetList);
    }
    while (!is_null(newBulletList)) {
        const bullet = head(newBulletList);
        drawString(screen, get_x(bullet) + halfWidth - ship_x, get_y(bullet) + halfHeight - ship_y, get_sprite(bullet));
        newBulletList = tail(newBulletList);
    }
    drawString(screen, halfWidth, halfHeight, get_sprite(ship));
    aim_ship(screen, ship, halfWidth, halfHeight);
}
export function aim_ship(screen, ship, width, height) {
    const angle = ship.gameObject.rotAngle;
    for (let i = 2; i <= 6; i += 2) {
        drawString(screen, width + i * Math.cos(angle), height + i * Math.sin(angle), "+");
    }
}
