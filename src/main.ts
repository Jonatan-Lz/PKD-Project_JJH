import { list, List } from "../lib/list.js";
import { createScreen, drawScreen, printer} from "./drawScreen.js";
import { createPlanet } from "./planet.js";
import { createShip } from "./ship.js";
import { change_location, get_x, get_y, planet, ship } from "./types.js";
const screen = createScreen();
const planet_list: List<planet> = list(createPlanet(3, 4, 4),createPlanet(3, 35, 6),createPlanet(6, 14, 18));
let playerShip: ship = createShip(1, 0, 0, "A", 200);
let stop: boolean = false;

function handleKeyEvent(event: KeyboardEvent): void {
    const key = event.key;
    switch(key) {
        case "d":
            playerShip.xVel = 0.2;
            break;
        case "a":
            playerShip.xVel = -0.2;
            break;
        case "w":
            playerShip.yVel = -0.2;
            break;
        case "s":
            playerShip.yVel = 0.2;
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

function tick(){
    change_location(playerShip,
                    get_x(playerShip) + playerShip.xVel, 
                    get_y(playerShip) + playerShip.yVel);
    drawScreen(screen, planet_list, get_x(playerShip), get_y(playerShip), playerShip);
    const output = document.getElementById('output') as HTMLParagraphElement; 
    output.innerHTML = printer(screen);
    if(!stop){
        setTimeout(tick, 100);
    }
}
tick();
document.addEventListener('keydown', handleKeyEvent);
