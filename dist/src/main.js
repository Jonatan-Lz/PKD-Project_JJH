import { list, pair } from "../lib/list.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { collisionForEach } from "./generalFunction.js";
import { createPlanet, addTurretToPlanet } from "./planet.js";
import { createShip, ship_rotation_sprite, movement } from "./ship.js";
import { change_location, get_x, get_y } from "./types.js";
const randomassplanet = addTurretToPlanet({ tag: "planet",
    gameObject: {
        color: null,
        location: pair(-25, -10),
        hitbox: 8,
        rotAngle: 0,
        hp: 1,
        sprite: "O"
    },
    radius: 8,
    turrets: list()
});
//creates a screen
const screen = createScreen(105, 40);
//creates planets and puts them in a list
let planetList = list(createPlanet(3.21, 4.3, 4.1), createPlanet(3.3, 35.23, 6.12), createPlanet(6.42, 14.2, 18.5), randomassplanet);
//creates an empty bullet list
let bulletList = null;
//makes the ship!
let playerShip = createShip(0.5, 0, 0, "A", 200);
let stop = false;
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
            stop = true;
            break;
    }
}
//handles what happens when you let
//go of a key.
function handleKeyUpEvent(event) {
}
//simulates what happens in the world.
function simulate() {
    if (0 <= collisionForEach(playerShip, planetList)) {
        stop = true;
    }
    change_location(playerShip, get_x(playerShip) + playerShip.xVel, get_y(playerShip) + playerShip.yVel);
    ship_rotation_sprite(playerShip);
}
//ticker function. Continously calls upon itself, and
//draws the world on the website for each tick.
function ticker() {
    drawScreen(screen, planetList, playerShip);
    simulate();
    const output = document.getElementById('output');
    output.innerHTML = printer(screen);
    if (!stop) {
        setTimeout(ticker, 100);
    }
}
ticker();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
