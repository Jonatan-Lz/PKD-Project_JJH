import { is_null, head, tail } from "../lib/list.js";
import { get_x, get_y, get_sprite } from "./types.js";
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
function clearScreen(world) {
    for (let y = 0; y < world.length; y++) {
        for (let x = 0; x < world[y].length; x++) {
            world[y][x] = "_";
        }
    }
}
/**
 * Turns a world into a string to be drawn on the website.
 * @param world - world to turn to string
 * @returns the world in string format
 */
export function printer(world) {
    let screen = "";
    for (let y = 0; y < world.length; y++) {
        for (let x = 0; x < world[y].length; x++) {
            screen = screen + " " + world[y][x];
        }
        screen = screen + "<br>";
    }
    return screen;
}
/**
 * Draws a circle in a given world
 * @param world world to draw on
 * @param radius radius of the planet
 * @param x x-coordinate of the planet center
 * @param y y-coordinate of the planet center
 * @param sprite graphics for the planet
 */
function drawCircle(world, radius, x, y, sprite) {
    for (let y1 = 0; y1 < world.length; y1++) {
        for (let x1 = 0; x1 < world[y1].length; x1++) {
            if (Math.sqrt((Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2))) <= radius) {
                world[y1][x1] = sprite;
            }
        }
    }
}
//writes the sprite on designated coordinates, on given world.
function drawString(world, x, y, sprite) {
    world[y][x] = sprite;
}
/**
 * Draws the world on the document
 * @param world world to draw
 * @param planetList planets to put on the world
 * @param x
 * @param y
 * @param ship
 */
export function drawScreen(world, planetList, ship) {
    const halfWidth = Math.floor(world[0].length / 2);
    const halfHeight = Math.floor(world.length / 2);
    let ship_x = get_x(ship);
    let ship_y = get_y(ship);
    clearScreen(world);
    let newPlanetList = planetList;
    while (!is_null(newPlanetList)) {
        const planet = head(newPlanetList);
        drawCircle(world, planet.radius, get_x(planet) + halfWidth - ship_x, get_y(planet) + halfHeight - ship_y, get_sprite(planet));
        newPlanetList = tail(newPlanetList);
    }
    drawString(world, halfWidth, halfHeight, get_sprite(ship));
}
