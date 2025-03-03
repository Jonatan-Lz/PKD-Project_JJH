import { append, head, is_null, pair, tail } from "../lib/list.js";
import { collisionForEach } from "./generalFunction.js";
const amount = 5; //number of planets in a chunk
const minSize = 4; //Planets min size
const maxSize = 10; // planets max size
/**
 * Creates and returns a planet
 * @param radius radius of planet
 * @param x x-coordinate of planet
 * @param y y-coordinate of planet
 * @returns created planet
 */
export function createPlanet(radius, x, y) {
    return { tag: "planet", gameObject: { color: null,
            location: pair(x, y),
            hitbox: radius,
            rotAngle: 0,
            hp: 1,
            sprite: "O" },
        radius: radius };
}
/**
 * Generates the world around the player
 * @param world the world
 * @param x the players chunks x
 * @param y the players chunks y
 * @param chunkSize the size of a chunk
 */
export function generatePlayerWorld(world, x, y, chunkSize) {
    let undefindChunks = gatherUndefinedChunks(world, x, y);
    while (!is_null(undefindChunks)) {
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
function gatherUndefinedChunks(world, x, y) {
    let chunks = null;
    for (let chunkX = -1; chunkX <= 1; chunkX++) {
        for (let chunkY = -1; chunkY <= 1; chunkY++) {
            const chunk = getChunk(world, x + chunkX, y + chunkY);
            if (chunk === undefined) {
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
 * @param chunkSize the chunks size
 * @returns a chunk
 */
export function generateChunk(world, x, y, chunkSize) {
    const currentChunk = getChunk(world, x, y);
    if (currentChunk === undefined) {
        const surroundingPlanets = gatherPlanetList(world, x, y);
        return { planets: generatePlanets(surroundingPlanets, x * chunkSize, y * chunkSize, chunkSize),
            bullets: null,
            turrets: null
        };
    }
    else {
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
export function gatherPlanetList(world, x, y) {
    let planetList = null;
    for (let chunkX = -1; chunkX <= 1; chunkX++) {
        for (let chunkY = -1; chunkY <= 1; chunkY++) {
            const chunk = getChunk(world, x + chunkX, y + chunkY);
            if (chunk != undefined) {
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
 * @param chunkSize the size of a chunk
 * @returns a list of planets that do not collide with eachother
 */
function generatePlanets(planets, xOffset, yOffset, chunkSize) {
    let planetList = null;
    for (let i = amount; i > 0; i--) {
        console.log(xOffset + " " + yOffset);
        const planet = createPlanet(Math.random() * (maxSize - minSize) + minSize, Math.random() * chunkSize + xOffset, Math.random() * chunkSize + yOffset);
        if (collisionForEach(planet, planets) >= 0 || collisionForEach(planet, planetList) >= 0) {
            i++;
            continue;
        }
        planetList = pair(planet, planetList);
    }
    return planetList;
}
//Gets the chunk of x, y
function getChunk(world, x, y) {
    return world[x + "," + y];
}
