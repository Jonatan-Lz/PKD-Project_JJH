import { list } from "../lib/list.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { collisionForEach, get_x, get_y, change_location } from "./generalFunction.js";
import { createPlanet, gatherPlanetList, generatePlayerWorld } from "./planet.js";
import { createShip, ship_rotation_sprite, movement, aim_ship } from "./ship.js";
//creates a screen
const screen = createScreen(105, 40);
//creates planets and puts them in a list
let planetList = list(createPlanet(3.21, 4.3, 4.1), createPlanet(3.3, 35.23, 6.12), createPlanet(6.42, 14.2, 18.5));
//creates an empty bullet list
let bulletList = null;
//makes the ship!
let playerShip = createShip(0.5, 0, 0, "A", 200);
//ships current chunks x pos
let shipChunkX = 0;
//ships current chunks y pos
let shipChunkY = 0;
//Stops the game
let stop = false;
//pauses the game
let pause = true;
let keys = { w: false, a: false, s: false, d: false, r: false,
    up: false, left: false, down: false, right: false };
const worldChunks = {}; // each chunk is defined by a 100x100 area (for now)
const chunkSize = 100;
//handles input.
//WASD -> ship movement
//p -> pause
//r -> stop ship
function handleKeyDownEvent(event) {
    const key = event.key;
    switch (key) {
        case "d":
            movement(key, playerShip);
            keys.d = true;
            break;
        case "a":
            movement(key, playerShip);
            keys.a = true;
            break;
        case "w":
            movement(key, playerShip);
            keys.w = true;
            break;
        case "s":
            movement(key, playerShip);
            keys.s = true;
            break;
        case "r":
            movement(key, playerShip);
            keys.r = true;
            break;
        case "p":
            pause = !pause;
            break;
    }
    switch (key) {
        case "ArrowUp":
            console.log("keyDown up");
            keys.up = true;
            break;
        case "ArrowLeft":
            console.log("keyDown left");
            keys.left = true;
            break;
        case "ArrowDown":
            console.log("keyDown down");
            keys.down = true;
            break;
        case "ArrowRight":
            console.log("keyDown right");
            keys.right = true;
            break;
    }
}
//handles what happens when you let
//go of a key.
function handleKeyUpEvent(event) {
    const key = event.key;
    switch (key) {
        case "d":
            keys.d = false;
            break;
        case "a":
            keys.a = false;
            break;
        case "w":
            keys.w = false;
            break;
        case "s":
            keys.s = false;
            break;
        case "r":
            keys.r = false;
            break;
    }
    switch (key) {
        case "ArrowUp":
            console.log("keyUp up");
            keys.up = true;
            break;
        case "ArrowLeft":
            console.log("keyUp left");
            keys.left = true;
            break;
        case "ArrowDown":
            console.log("keyUp down");
            keys.down = true;
            break;
        case "ArrowRight":
            console.log("keyUp right");
            keys.right = true;
            break;
    }
}
//simulates what happens in the world.
function simulate(planets) {
    if (0 <= collisionForEach(playerShip, planets)) {
        stop = true;
    }
    change_location(playerShip, get_x(playerShip) + playerShip.xVel, get_y(playerShip) + playerShip.yVel);
    ship_rotation_sprite(playerShip);
}
//ticker function. Continously calls upon itself, and
//draws the world on the website for each tick.
function ticker() {
    if (pause) {
        shipChunkX = Math.floor(get_x(playerShip) / chunkSize);
        shipChunkY = Math.floor(get_y(playerShip) / chunkSize);
        generatePlayerWorld(worldChunks, shipChunkX, shipChunkY, chunkSize);
        const surroundingPlanets = gatherPlanetList(worldChunks, shipChunkX, shipChunkY);
        simulate(surroundingPlanets);
        drawScreen(screen, surroundingPlanets, playerShip);
        aim_ship(keys, playerShip, screen);
        const output = document.getElementById('output');
        output.innerHTML = printer(screen);
    }
    if (!stop) {
        setTimeout(ticker, 100);
    }
}
ticker();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
