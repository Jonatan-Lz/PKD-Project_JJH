import { head, is_null, list, tail } from "../lib/list.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { collision } from "./generalFunction.js";
import { createPlanet } from "./planet.js";
import { createShip } from "./ship.js"; 
import { change_location, get_x, get_y } from "./types.js";
//creates a screen
const screen = createScreen(100, 20); 
//creates planets and puts them in a list
const planetList = list(createPlanet(3, 4, 4), createPlanet(3, 35, 6), createPlanet(6, 14, 18));
//makes the ship!
let playerShip = createShip(0.5, 0, 0, "A", 200);
let stop = false;
function handleKeyEvent(event) { 
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
function simulate() { 
    let newPlanetList = planetList;
    while (!is_null(newPlanetList)) {
        const planet = head(newPlanetList);
        if (collision(planet, playerShip)) {
            stop = true;
        }
        newPlanetList = tail(newPlanetList);
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
tick(); 
document.addEventListener('keydown', handleKeyEvent);
