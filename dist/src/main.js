import { head, is_null, tail } from "../lib/list.js";
import { gatherBulletList, moveAll, removeBullet, spawnBullet } from "./bullet.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { collisionForEach } from "./generalFunction.js";
import { gatherPlanetList, generatePlayerWorld, getChunk } from "./planet.js";
import { createShip, ship_rotation_sprite, movement } from "./ship.js";
import { change_location, chunkX, chunkY, get_x, get_y } from "./types.js";
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
        case "a":
        case "w":
        case "s":
        case "r":
            movement(key, playerShip);
            break;
        case "p":
            pause = !pause;
            break;
        case "f":
            const chunk = getChunk(worldChunks, shipChunkX, shipChunkY);
            if (chunk != undefined) {
                spawnBullet(chunk, get_x(playerShip), get_y(playerShip), playerShip.gameObject.rotAngle, 2, false);
            }
    }
}
//handles what happens when you let
//go of a key.
function handleKeyUpEvent(event) {
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
