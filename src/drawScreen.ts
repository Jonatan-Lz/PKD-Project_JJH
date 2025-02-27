import{ length, List, is_null, head, tail } from "../lib/list.js"
import{ get_x, get_y,get_sprite, planet, world, ship } from "./types.js"

//creates a screen for graphics to be written on
export function createScreen(): world {
    let screen: world = [[]];
    let b: Array<string> = [];
    for(let x = 0; x < 100; x++){
        b.push("_");
    }
    screen[0] = b;
    for(let y = 1; y < 20; y++){
        b = [];
        for(let x = 0; x < 100; x++){
            b.push("_");
        }
        screen.push(b);
    }
    return screen;
}

//clears the screen (turns each index to "_")
function clearScreen(world: world): void{
    for(let y = 0; y < world.length; y++){
        for(let x = 0; x < world[y].length; x++){
            world[y][x] = "_";
        }
    }
}

/**
 * Turns a world into a string to be drawn on the website.
 * @param world - world to turn to string
 * @returns the world in string format
 */
export function printer(world: world): string{
    let screen = "";
    for(let y = 0; y < world.length; y++){
        for(let x = 0; x < world[y].length; x++){
            screen = screen + world[y][x];
        }
        screen = screen + "<br>";
    }
    return screen;
} 

/**
 * 
 * @param world world to draw on
 * @param radius radius of the planet
 * @param x x-coordinate of the planet center
 * @param y y-coordinate of the planet center
 * @param sprite graphics for the planet 
 */
function drawCircle(world: world, radius: number, x: number, y: number, sprite: string): void{
    for(let y1 = 0; y1 < world.length; y1++){
        for(let x1 = 0; x1 < world[y1].length; x1++){
            if(Math.sqrt(((x1 - x)**2 + (y1 - y)**2)) <= radius){
                world[y1][x1] = sprite;
            }
        }
    }
}

function drawString(world: world, x: number, y: number, sprite: string): void{
    world[y][x] = sprite;
}

/**
 * 
 * @param world world to draw
 * @param planetList planets to put on the world
 * @param x 
 * @param y 
 * @param ship 
 */
export function drawScreen(world: world, planetList: List<planet>, ship: ship){
    let ship_x = get_x(ship);
    let ship_y = get_y(ship);
    clearScreen(world);
    let newPlanetList = planetList;
    while(!is_null(newPlanetList)){
        const planet = head(newPlanetList);
        drawCircle(world, planet.radius, get_x(planet) - ship_x, get_y(planet) - ship_y, get_sprite(planet));
        newPlanetList = tail(newPlanetList);
    }
    drawString(world, Math.floor(world[0].length/2), Math.floor(world.length/2), get_sprite(ship));
    console.log(world);
}