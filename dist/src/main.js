import { head, is_null, list, tail } from "../lib/list.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { collision } from "./generalFunction.js";
import { createPlanet } from "./planet.js";
import { createShip } from "./ship.js";
import { change_location, get_x, get_y } from "./types.js";
//creates a screen
const screen = createScreen(105, 40);
//creates planets and puts them in a list
const planetList = list(createPlanet(3, 4, 4), createPlanet(3, 35, 6), createPlanet(6, 14, 18));
//makes the ship!
let playerShip = createShip(1, 0, 0, "A", 200);
let stop = false;
function handleKeyEvent(event) {
    const key = event.key;
    switch (key) {
        case "d":
            playerShip.xVel = 0.3;
            break;
        case "a":
            playerShip.xVel = -0.3;
            break;
        case "w":
            playerShip.yVel = -0.3;
            break;
        case "s":
            playerShip.yVel = 0.3;
            break;
        case "p":
            stop = true;
            break;
        case "r":
            playerShip.xVel = 0;
            playerShip.yVel = 0;
            break;
    }
}
function simulate() {
    let newPlanetList = planetList;
    while (!is_null(newPlanetList)) {
        const planet = head(newPlanetList);
        if (collision(planet, playerShip)) {
            stop = true;
        }
        newPlanetList = tail(newPlanetList);
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
document.addEventListener('keydown', handleKeyEvent);
