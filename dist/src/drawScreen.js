import { is_null, head, tail } from "../lib/list.js";
import { get_x, get_y, get_sprite } from "./types.js";
export function createScreen() {
    let screen = [[]];
    let b = [];
    for (let x = 0; x < 100; x++) {
        b.push("_");
    }
    screen[0] = b;
    for (let y = 1; y < 20; y++) {
        b = [];
        for (let x = 0; x < 100; x++) {
            b.push("_");
        }
        screen.push(b);
    }
    return screen;
}
function clearScreen(world) {
    for (let y = 0; y < world.length; y++) {
        for (let x = 0; x < world[y].length; x++) {
            world[y][x] = "_";
        }
    }
}
export function printer(world) {
    let screen = "";
    for (let y = 0; y < world.length; y++) {
        for (let x = 0; x < world[y].length; x++) {
            screen = screen + world[y][x];
        }
        screen = screen + "<br>";
    }
    return screen;
}
function drawCircle(world, radius, x, y, sprite) {
    for (let y1 = 0; y1 < world.length; y1++) {
        for (let x1 = 0; x1 < world[y1].length; x1++) {
            if (Math.sqrt((Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2))) <= radius) {
                world[y1][x1] = sprite;
            }
        }
    }
}
function drawString(world, x, y, sprite) {
    world[y][x] = sprite;
}
export function drawScreen(world, planetList, x, y, ship) {
    const halfWidth = Math.floor(world[0].length / 2);
    const halfHeight = Math.floor(world.length / 2);
    x = x - halfWidth;
    y = y - halfHeight;
    clearScreen(world);
    let newPlanetList = planetList;
    while (!is_null(newPlanetList)) {
        const planet = head(newPlanetList);
        drawCircle(world, planet.radius, get_x(planet) - x, get_y(planet) - y, get_sprite(planet));
        newPlanetList = tail(newPlanetList);
    }
    drawString(world, halfWidth, halfHeight, get_sprite(ship));
}
