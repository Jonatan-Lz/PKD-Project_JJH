import { list } from "../lib/list.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { collisionForEach } from "./generalFunction.js";
import { createPlanet } from "./planet.js";
import { createShip, movement } from "./ship.js";
import { change_location, get_x, get_y } from "./types.js";
//creates a screen
const screen = createScreen(100, 50);
//creates planets and puts them in a list
let planetList = list(createPlanet(3.21, 4.3, 4.1), createPlanet(3.3, 35.23, 6.12), createPlanet(6.42, 14.2, 18.5));
//creates an empty bullet list
let bulletList = null;
//makes the ship!
let playerShip = createShip(0.5, 0, 0, "A", 200);
let stop = false;
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
function handleKeyUpEvent(event) {
}
function simulate() {
    if (0 <= collisionForEach(playerShip, planetList)) {
        stop = true;
    }
}
function tick() {
    change_location(playerShip, get_x(playerShip) + playerShip.xVel, get_y(playerShip) + playerShip.yVel);
    drawScreen(screen, planetList, playerShip);
    simulate();
    const output = document.getElementById('output');
    output.innerHTML = printer(screen);
    if (!stop) {
        setTimeout(tick, 100);
    }
}
tick();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
