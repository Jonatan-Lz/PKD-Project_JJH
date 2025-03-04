import { head, is_null, tail } from "../lib/list.js";
import { gatherBulletList, moveAll, removeBullet, spawnBullet } from "./bullet.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { change_location, chunkX, chunkY, collisionForEach, get_x, get_y } from "./generalFunction.js";
import { gatherPlanetList, generatePlayerWorld, getChunk } from "./planet.js";
import { createShip, ship_rotation_sprite, movement } from "./ship.js";
//creates a screen
const screen = createScreen(105, 50);
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
const delay = 100; //milliseconds before next frame
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
        case "f":
            const chunk = getChunk(worldChunks, shipChunkX, shipChunkY);
            if (chunk != undefined) {
                spawnBullet(chunk, get_x(playerShip), get_y(playerShip), playerShip.gameObject.rotAngle, 2, false);
            }
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
function simulate(planets, bullets) {
    moveAll(worldChunks, bullets);
    change_location(playerShip, get_x(playerShip) + playerShip.xVel, get_y(playerShip) + playerShip.yVel);
    if (null != collisionForEach(playerShip, planets)) {
        stop = true;
    }
    let newBulletList = bullets;
    while (!is_null(newBulletList)) {
        const bullet = head(newBulletList);
        if (null != collisionForEach(bullet, planets)) {
            removeBullet(worldChunks, bullet);
        }
        newBulletList = tail(newBulletList);
    }
    ship_rotation_sprite(playerShip);
}
//ticker function. Continously calls upon itself, and
//draws the world on the website for each tick.
function ticker() {
    if (pause) {
        shipChunkX = chunkX(get_x(playerShip));
        shipChunkY = chunkY(get_y(playerShip));
        generatePlayerWorld(worldChunks, shipChunkX, shipChunkY);
        const surroundingPlanets = gatherPlanetList(worldChunks, shipChunkX, shipChunkY);
        const surroundingBullets = gatherBulletList(worldChunks, shipChunkX, shipChunkY);
        simulate(surroundingPlanets, surroundingBullets);
        drawScreen(screen, surroundingPlanets, surroundingBullets, playerShip);
        const output = document.getElementById('output');
        output.innerHTML = printer(screen);
    }
    if (!stop) {
        setTimeout(ticker, delay);
    }
}
ticker();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
