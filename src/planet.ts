import {chunk, world, chunkSize, planet, turret} from "./types.js";
import {append, head, is_null, List, list, Pair, pair, tail} from "../lib/list.js";
import {createGameobject, minDistCollisionForEach, get_x, get_y} from "./generalFunction.js";

const amount = 5; //number of planets in a chunk
const minSize = 4; //Planets min size
const maxSize = 10; // planets max size
const minDist = 7; // minimum distance between planets

/**
 * Creates and returns a planet
 * @param radius radius of planet
 * @param x x-coordinate of planet
 * @param y y-coordinate of planet
 * @returns created planet
 */
export function createPlanet(radius: number, x: number, y: number): planet{
    return {tag: "planet", gameObject: 
            createGameobject(x, y, radius, 1, "O"),
            radius: radius,
            turrets: list()};
}

// a basic turret at 0, 0
export const basicTurret: turret = {
    tag: "turret", 
    gameObject: createGameobject(0, 0, 1, 1, "X")
};

/**
 * Creates a basic turret to a given planet (((((WIP)))))
 * @param planet the planet the turret is tied to
 * @returns the planet with the added turret
 */
export function addTurretToPlanet(planet: planet): planet {
    var turret = basicTurret;
    function randomXYOnPlanetSurface(planet: planet): Pair<number, number> {
        const x = head(planet.gameObject.location) - planet.radius + Math.floor(Math.random() * 2 * planet.radius + 1); //chooses a random x within the planet's diameter
        // (x - a)^2 + (y - b)^2 = r^2    ==>    sqrt((y - b)^2) = sqrt(r^2 - (x - a)^2)    ==>    y = sqrt(r^2 - (x - a)^2) - b
        let y = Math.sqrt(planet.radius**2 - (x - head(planet.gameObject.location))**2) - tail(planet.gameObject.location); // y calculated through (x - a)^2 + (y - b)^2 = r^2 
        //if (Math.random() < 0.5) {y = -y} else {} // 50% to make y negative for +- from taking square root
        return pair(x, y);
    }
    //turret.gameObject.location = randomXYOnPlanetSurface(planet);
    turret.gameObject.location = pair(get_x(planet) + planet.radius + 1, get_y(planet)) //temp test
    planet.turrets = append(planet.turrets, list(turret));
    return planet;
}

/**
 * Generates the world around the player
 * @param world the world
 * @param x the players chunks x
 * @param y the players chunks y
 */
export function generatePlayerWorld(world: world, x: number, y: number): void{
    let undefindChunks = gatherUndefinedChunks(world, x, y);
    while(!is_null(undefindChunks)){
        const chunk = head(undefindChunks);
        const chunkX = head(chunk);
        const chunkY = tail(chunk);
        world[chunkX + "," + chunkY] = generateChunk(world, chunkX, chunkY, chunkSize);
        undefindChunks = tail(undefindChunks);
    }
}

/**
 * gathers all undefined chunks
 * @param world the world
 * @param x the origin x
 * @param y the origin y
 * @returns a list of the undefined chunks represented as pair(x, y) 
 */
function gatherUndefinedChunks(world: world, x: number, y: number): List<Pair<number, number>>{
    let chunks = null;
    for(let chunkX = -1; chunkX <= 1; chunkX++){
        for(let chunkY = -1; chunkY <= 1; chunkY++){
            const chunk = getChunk(world, x + chunkX, y + chunkY);
            if(chunk === undefined){
                chunks = pair(pair((x + chunkX), (y + chunkY)), chunks);
            }
        }
    }
    return chunks;
}

/**
 * Generates a chunk based on x and y
 * @param world the world
 * @param x the chunks x position
 * @param y the chunks y position
 * @returns a chunk
 */
export function generateChunk(world: world, x: number, y: number, chunkSize: number): chunk{
    const currentChunk = getChunk(world, x, y)
    if (currentChunk === undefined){
        const surroundingPlanets = gatherPlanetList(world, x, y);
        return {planets: generatePlanetList(surroundingPlanets, x * chunkSize, y * chunkSize),
                bullets: null,
                turrets: null
                } 
    } else {
        return currentChunk;
    }
}

/**
 * Gathers all planets in the surrounding chunks 3x3 around the current
 * @param world the world
 * @param x current chunk x
 * @param y current chunk y
 * @returns list of planets
 */
export function gatherPlanetList(world: world, x: number, y: number): List<planet>{
    let planetList = null;
    for(let chunkX = -1; chunkX <= 1; chunkX++){
        for(let chunkY = -1; chunkY <= 1; chunkY++){
            const chunk = getChunk(world, x + chunkX, y + chunkY);
            if(chunk != undefined){
                planetList = append(planetList, chunk.planets);
            }
        }
    }
    return planetList;
}
/**
 * (note) kinda bad, if unlucky might lag due to loop being rerun a bunch of times
 * Generates a list of planets in a chunk
 * @param planets list of planets in the surrounding chunks 3x3
 * @param xOffset what xOffset the planets should have (chunk 3,-2: xOffset = 300)
 * @param yOffset what yOffset the planets should have (chunk 3,-2: yOffset = -200)
 * @returns a list of planets that do not collide with eachother
 */
function generatePlanetList(planets: List<planet>, xOffset: number, yOffset: number): List<planet>{
    let planetList = null
    for(let i = amount; i > 0; i--){
        const planet = createPlanet(Math.random() * (maxSize - minSize) + minSize, 
                                    Math.random() * chunkSize + xOffset, 
                                    Math.random() * chunkSize + yOffset);
        if(minDistCollisionForEach(planet, planets, minDist) >= 0 || minDistCollisionForEach(planet, planetList, minDist) >= 0){
            i++; continue;
        }
        planetList = pair(planet, planetList);
    }
    return planetList;
}

//Gets the chunk of x, y
export function getChunk(world: world, x: number, y: number): chunk|undefined{
    return world[x + "," + y];
}
