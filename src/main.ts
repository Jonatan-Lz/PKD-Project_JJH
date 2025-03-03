import { head, is_null, list, List, tail } from "../lib/list.js";
import { createScreen, drawScreen, printer} from "./drawScreen.js";
import { collision, collisionForEach } from "./generalFunction.js";
import { createPlanet, gatherPlanetList, generatePlayerWorld } from "./planet.js";
import { createShip, ship_rotation_sprite, movement} from "./ship.js";
import { bullet, change_location, chunks, get_x, get_y, planet, ship } from "./types.js";

//creates a screen
const screen = createScreen(105, 50);
//creates planets and puts them in a list
let planetList: List<planet> = list(createPlanet(3.21, 4.3, 4.1),createPlanet(3.3, 35.23, 6.12),createPlanet(6.42, 14.2, 18.5));
//creates an empty bullet list
let bulletList: List<bullet> = null;
//makes the ship!
let playerShip: ship = createShip(0.5, 0, 0, "A", 200);
//ships current chunks x pos
let shipChunkX: number = 0;
//ships current chunks y pos
let shipChunkY: number = 0; 
//Stops the game
let stop: boolean = false;
//pauses the game
let pause: boolean = true;
const worldChunks: chunks = {}; // each chunk is defined by a 100x100 area (for now)
const chunkSize: number = 100;

//handles input.
//WASD -> ship movement
//p -> pause
//r -> stop ship
function handleKeyDownEvent(event: KeyboardEvent): void {
    const key: string = event.key;
    switch(key) {
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
       
      } 
}

//handles what happens when you let
//go of a key.
function handleKeyUpEvent(event: KeyboardEvent): void {
}

//simulates what happens in the world.
function simulate(planets: List<planet>): void{
    if(0 <= collisionForEach(playerShip, planets)){
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
    if(pause){
        shipChunkX = Math.floor(get_x(playerShip) / chunkSize);
        shipChunkY = Math.floor(get_y(playerShip) / chunkSize);
        generatePlayerWorld(worldChunks, shipChunkX, shipChunkY, chunkSize);
        const surroundingPlanets = gatherPlanetList(worldChunks, shipChunkX, shipChunkY);
        simulate(surroundingPlanets);
        drawScreen(screen, surroundingPlanets, playerShip);
        const output = document.getElementById('output') as HTMLParagraphElement; 
        output.innerHTML = printer(screen);
    }
    if(!stop){
        setTimeout(ticker, 100);
    }
}
ticker();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
