import { for_each, head, is_null, list, List, tail, pair } from "../lib/list.js";
import { gatherBulletList, moveAll, removeBullet, spawnBullet } from "./bullet.js";
import { createScreen, drawScreen, printer} from "./drawScreen.js";
import { change_location, calc_chunkX, calc_chunkY, collision, collisionForEach, createGameobject, get_x, get_y, get_hp } from "./generalFunction.js";
import { createPlanet, addTurretToPlanet, gatherPlanetList, generatePlayerWorld, getChunk, gatherTurretList, shootTurrets, removeTurret } from "./planet.js";
import { createShip, ship_rotation_sprite, movement , aimShipTurret} from "./ship.js";
import { bullet, world, planet, ship, keys_pressed, turret} from "./types.js";

//creates a screen
const screen = createScreen(105, 50);
//makes the ship!
export let playerShip: ship = createShip(0.5, 0, 0, "A");
//ships current chunks x pos
let shipChunkX: number = 0;
//ships current chunks y pos
let shipChunkY: number = 0; 
//Stops the game
let stop: boolean = false;
//pauses the game
let pause: boolean = true;
let keys: keys_pressed = {w: false, a: false, s: false, d: false, r: false,
                          up: false, left: false, down: false, right: false};

const worldChunks: world = {}; // each chunk is defined by a 100x100 area (for now)
const delay = 40; //milliseconds before next frame


//handles input.
//WASD -> ship movement
//p -> pause
//r -> stop ship
function handleKeyDownEvent(event: KeyboardEvent): void {
    if(pause){
        pause = false;
    }
    const key: string = event.key;
    switch(key) {
        case "d":
            keys.d = true;
            break;
        case "a":
            keys.a = true;
            break;
        case "w":
            keys.w = true;
            break;
        case "s":
            keys.s = true;
            break;
        case "r":
            keys.r = true;
            break;
        case "p":
            pause = true;
            break;
        case "f":
            const chunk = getChunk(worldChunks, shipChunkX, shipChunkY);
            if( chunk != undefined){
                spawnBullet(chunk, get_x(playerShip), get_y(playerShip), playerShip.gameObject.rotAngle, true);
            }
            break;
        case "ArrowUp":
            keys.up = true;
            break;
        case "ArrowLeft":
            keys.left = true;
            break;
        case "ArrowDown":
            keys.down = true;
            break;
        case "ArrowRight":
            keys.right = true;
            break;
        }
    }

//handles what happens when you let
//go of a key.
function handleKeyUpEvent(event: KeyboardEvent): void {
    const key = event.key;
    switch(key) {
        case "d":
            keys.d = false;
            break;
        case "a":
            keys.a = false;
            break;
        case "w":
            keys.w = false;
            break;
        case "s":
            keys.s = false;
            break;
        case "r":
            keys.r = false;
            break;
        case "ArrowUp":
            keys.up = false;
            break;
        case "ArrowLeft":
            keys.left = false;
            break;
        case "ArrowDown":
            keys.down = false;
            break;
        case "ArrowRight":
            keys.right = false;
            break;
    }
}

//simulates what happens in the world.
function simulate(planets: List<planet>, bullets: List<bullet>, turrets: List<turret>): void{
    moveAll(worldChunks, bullets);
    change_location(playerShip,
        get_x(playerShip) + playerShip.xVel, 
        get_y(playerShip) + playerShip.yVel);
    if(null != collisionForEach(playerShip, planets)){
        stop = true;
    }
    //checks collision for each bullet
    let newBulletList = bullets;
    while(!is_null(newBulletList)){
        const bullet = head(newBulletList);
        if(null != collisionForEach(bullet, planets)){
            removeBullet(worldChunks, bullet)
        }
        if(bullet.friendly){
            const turret = <turret> collisionForEach(bullet, turrets);
            if(null != turret){
                removeBullet(worldChunks, bullet);
                removeTurret(turret, worldChunks);
            }
        } else {
            if(collision(bullet, playerShip)){
                playerShip.gameObject.hp -= get_hp(bullet);
                console.log(get_hp(playerShip));
                if(get_hp(playerShip) <= 0){
                    stop = true;
                    break;
                } else {
                    removeBullet(worldChunks, bullet);
                }
            }
        }
        newBulletList = tail(newBulletList);
    }
    ship_rotation_sprite(playerShip);
}

//ticker function. Continously calls upon itself, and
//draws the world on the website for each tick.
function ticker(): void{
    if(!pause){
        shipChunkX = calc_chunkX(get_x(playerShip));
        shipChunkY = calc_chunkY(get_y(playerShip));
        generatePlayerWorld(worldChunks, shipChunkX, shipChunkY);
        const surroundingPlanets = gatherPlanetList(worldChunks, shipChunkX, shipChunkY);
        const surroundingTurrets = gatherTurretList(surroundingPlanets);
        shootTurrets(worldChunks, surroundingTurrets, playerShip);
        const surroundingBullets = gatherBulletList(worldChunks, shipChunkX, shipChunkY);
        simulate(surroundingPlanets, surroundingBullets, surroundingTurrets);
        drawScreen(screen, surroundingPlanets, surroundingBullets, playerShip);
        const output = document.getElementById('output') as HTMLParagraphElement; 
        output.innerHTML = printer(screen);
        movement(keys, playerShip);
        aimShipTurret(keys, playerShip);
    }
    if(!stop){
        setTimeout(ticker, delay);
    }
}
ticker();
document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('keyup', handleKeyUpEvent);
