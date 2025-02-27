import { list } from "../lib/list.js";
import { createScreen, drawScreen, printer } from "./drawScreen.js";
import { createPlanet } from "./planet.js";
import { createShip } from "./ship.js";
import { change_location, get_x, get_y } from "./types.js";
//creates a screen
const screen = createScreen(100, 20);
//creates planets and puts them in a list
const planet_list = list(createPlanet(3, 4, 4), createPlanet(3, 35, 6), createPlanet(6, 14, 18));
//makes the ship!
let playerShip = createShip(1, 0, 0, "A", 200);
//This function handles the inputs to move the ship with.
function handleKeyEvent(event) {
    const key = event.key;
    if (key === "d") {
        change_location(playerShip, get_x(playerShip) + 1, get_y(playerShip));
    }
    else if (key === "a") {
        change_location(playerShip, get_x(playerShip) - 1, get_y(playerShip));
    }
    else if (key === "w") {
        change_location(playerShip, get_x(playerShip), get_y(playerShip) - 1);
    }
    else if (key === "s") {
        change_location(playerShip, get_x(playerShip), get_y(playerShip) + 1);
    }
    drawScreen(screen, planet_list, playerShip);
    const output = document.getElementById('output');
    output.innerHTML = printer(screen);
}
document.addEventListener('keydown', handleKeyEvent);
