import{ length, List, is_null, head, tail } from "../lib/list.js"
import{ planet, screen, ship, bullet, world } from "./types.js"
import{ get_x, get_y, get_sprite } from "./generalFunction.js"

/**
 * Creates and returns an empty world
 * @returns an empty world
 */
export function createScreen(width: number, height: number): screen {
    let screen: screen = [[]];
    let b: Array<string> = [];
    for(let x = 0; x < width; x++){
        b.push("_");
    }
    screen[0] = b;
    for(let y = 1; y < height; y++){
        b = [];
        for(let x = 0; x < width; x++){
            b.push("_");
        }
        screen.push(b);
    }
    return screen;
}

//clears the screen (turns each index to "_")
function clearScreen(screen: screen): void{
    for(let y = 0; y < screen.length; y++){
        for(let x = 0; x < screen[y].length; x++){
            screen[y][x] = "_";
        }
    }
}

/**
 * Turns a world into a string to be drawn on the website.
 * @param screen - world to turn to string
 * @returns the world in string format
 */
export function printer(screen: screen): string{
    let screenString = "";
    for(let y = 0; y < screen.length; y++){
        for(let x = 0; x < screen[y].length; x++){
            screenString = screenString + " " + screen[y][x];
        }
        screenString = screenString + "<br>";
    }
    return screenString;
} 

/**
 * Draws a circle in a given world
 * @param screen world to draw on
 * @param radius radius of the planet
 * @param x x-coordinate of the planet center
 * @param y y-coordinate of the planet center
 * @param sprite graphics for the planet 
 */
function drawCircle(screen: screen, radius: number, x: number, y: number, sprite: string): void{
    for(let y1 = 0; y1 < screen.length; y1++){
        for(let x1 = 0; x1 < screen[y1].length; x1++){
            if(Math.sqrt(((x1 - x)**2 + (y1 - y)**2)) <= radius){
                screen[y1][x1] = sprite;
            }
        }
    }
}

//writes the sprite on designated coordinates, on given world.
export function drawString(screen: screen, x: number, y: number, sprite: string): void{
    if(screen[Math.floor(y)] != undefined && screen[Math.floor(y)][Math.floor(x)] != undefined){
        screen[Math.floor(y)][Math.floor(x)] = sprite;
    }
}

/**
 * Redraws the world based on the parameters given
 * @param screen world to draw
 * @param planetList planets to put on the world
 * @param ship the ship
 */
export function drawScreen(screen: screen, planetList: List<planet>, bulletList: List<bullet>, ship: ship): void{
    const halfWidth = Math.floor(screen[0].length/2);
    const halfHeight = Math.floor(screen.length/2);
    let ship_x = get_x(ship);
    let ship_y = get_y(ship);
    clearScreen(screen);
    let newPlanetList = planetList;
    let newBulletList = bulletList;
    while(!is_null(newPlanetList)){
        const planet = head(newPlanetList);
        drawCircle(screen, planet.radius, 
                   get_x(planet) + halfWidth - ship_x,
                   get_y(planet) + halfHeight - ship_y, 
                   get_sprite(planet));
        let newTurretList = planet.turrets;
        while (!is_null(newTurretList)) { //draws all turrets for planet
            const turret = head(newTurretList);
            if (!is_null(turret)) {
                drawString(screen, 
                    get_x(turret) + halfWidth - ship_x, 
                    get_y(turret) + halfHeight - ship_y, 
                    get_sprite(turret));
            };
            newTurretList = tail(newTurretList);
        };
        newPlanetList = tail(newPlanetList);
    }
    while(!is_null(newBulletList)){
        const bullet = head(newBulletList);
        drawString(screen,
                   get_x(bullet) + halfWidth - ship_x, 
                   get_y(bullet) + halfHeight - ship_y, 
                   get_sprite(bullet))
        newBulletList = tail(newBulletList);
    }
    drawString(screen, halfWidth, halfHeight, get_sprite(ship));
    aim_ship(screen, ship, halfWidth, halfHeight);
    function displayScore(x: number, y: number, score: number): void {
        drawString(screen, x, y, "S");
        drawString(screen, x + 1, y, "C");
        drawString(screen, x + 2, y, "O");
        drawString(screen, x + 3, y, "R");
        drawString(screen, x + 4, y, "E");
        drawString(screen, x + 5, y, ":");
        drawString(screen, x + 7, y, "" + score);
    }
    displayScore(1, 1, ship.score);

    function displayPlayerHP(x: number, y: number, HP: number): void {
        drawString(screen, x, y, "H");
        drawString(screen, x + 1, y, "P");
        drawString(screen, x + 2, y, ":");
        drawString(screen, x + 4, y, "" + HP);
    }
    displayPlayerHP(1, 3, ship.gameObject.hp);
}

export function aim_ship(screen: screen, ship: ship, width: number, height:number){
    const angle = ship.gameObject.rotAngle;
    for(let i = 3; i <= 9; i += 3){
        drawString(screen, width + i * Math.cos(angle), height + i * Math.sin(angle), "+");
    }
}