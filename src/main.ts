import { head, is_null, list, List, tail } from "../lib/list.js";
import { createScreen, drawScreen, printer} from "./drawScreen.js";
import { collision, collisionForEach } from "./generalFunction.js";
import { createPlanet } from "./planet.js";
import { createShip, ship_rotation_sprite } from "./ship.js";
import { bullet, change_location, get_x, get_y, planet, ship } from "./types.js";

//creates a screen
const screen = createScreen(105, 40);
//creates planets and puts them in a list
let planetList: List<planet> = list(createPlanet(3.21, 4.3, 4.1),createPlanet(3.3, 35.23, 6.12),createPlanet(6.42, 14.2, 18.5));
//creates an empty bullet list
let bulletList: List<bullet> = null;
//makes the ship!
let playerShip: ship = createShip(1, 0, 0, "A", 200);
let stop: boolean = false;

//handles input.
//WASD -> ship movement
//p -> pause
//r -> stop ship
function handleKeyDownEvent(event: KeyboardEvent): void {
    const key: string = event.key;
    switch(key) {
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

//handles what happens when you let
//go of a key.
function handleKeyUpEvent(event: KeyboardEvent): void {
    const key = event.key;
    switch(key) {
        case "d":
        case "a":
            playerShip.xVel = 0;
            break;
        case "w":
        case "s":
            playerShip.yVel = 0;
            break;
      } 
}

//simulates what happens in the world.
function simulate(): void{
    if(0 <= collisionForEach(playerShip, planetList)){
        stop = true;
    }
    change_location(playerShip,
        get_x(playerShip) + playerShip.xVel, 
        get_y(playerShip) + playerShip.yVel);
    ship_rotation_sprite(playerShip);
}

//ticker function. Continously calls upon itself, and
//draws the world on the website for each tick.
function ticker(): void{
    drawScreen(screen, planetList, playerShip);
    simulate();
    const output = document.getElementById('output') as HTMLParagraphElement; 
    output.innerHTML = printer(screen);
    if(!stop){
        setTimeout(ticker, 100);
    }
}
ticker();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
