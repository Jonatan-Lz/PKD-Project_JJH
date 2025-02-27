import { list, List } from "../lib/list.js";
import { createScreen, drawScreen, printer} from "./drawScreen.js";
import { createPlanet } from "./planet.js";
import { createShip } from "./ship.js";
import { change_location, get_x, get_y, planet, ship } from "./types.js";
const screen = createScreen();
const planet_list: List<planet> = list(createPlanet(3, 4, 4),createPlanet(3, 35, 6),createPlanet(6, 14, 18));
let playerShip: ship = createShip(1, 0, 0, "A", 200);
function handleKeyEvent(event: KeyboardEvent): void {
    const key = event.key;
    if(key === "d"){
        change_location(playerShip, get_x(playerShip) + 1, get_y(playerShip));
    } else if(key === "a"){
        change_location(playerShip, get_x(playerShip) - 1, get_y(playerShip));
    } else if(key === "w"){
        change_location(playerShip, get_x(playerShip), get_y(playerShip) - 1);
    } else if(key === "s"){
        change_location(playerShip, get_x(playerShip), get_y(playerShip) + 1);
    }
    drawScreen(screen, planet_list, get_x(playerShip), get_y(playerShip), playerShip);
    const output = document.getElementById('output') as HTMLParagraphElement; 
    output.innerHTML = printer(screen);
}
document.addEventListener('keydown', handleKeyEvent);
