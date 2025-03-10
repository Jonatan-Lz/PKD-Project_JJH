import { chunkSize } from "./types.js";
import { append, head, is_null, list, pair, remove, tail } from "../lib/list.js";
import { createGameobject, minDistCollisionForEach, get_x, get_y, get_chunkX, get_chunkY, calc_chunkX, calc_chunkY } from "./generalFunction.js";
import { spawnBullet } from "./bullet.js";
import { playerShip } from "./main.js";
const amount = 5; //number of planets in a chunk
const minSize = 4; //Planets min size
const maxSize = 10; // planets max size
const minDist = 7; // minimum distance between planets
const turretsPerPlanet = 2;
const turretCooldown = 50;
const turretRange = 50;
/**
 * Creates and returns a planet
 * @param radius radius of planet
 * @param x x-coordinate of planet
 * @param y y-coordinate of planet
 * @returns created planet
 */
export function createPlanet(radius, x, y) {
    const planet = { tag: "planet", gameObject: createGameobject(x, y, radius, 1, "O"),
        radius: radius,
        turrets: list() };
    for (let i = 0; i < turretsPerPlanet; i++) {
        addTurretToPlanet(planet);
    }
    return planet;
}
/**
 * Creates and returns a tuuret
 * @param x x-coordinate of turret
 * @param y y-coordinate of turret
 * @returns created turret
 */
export function createTurret(x, y, planet) {
    return { tag: "turret", gameObject: createGameobject(x, y, 1, 1, "¤"), cooldown: turretCooldown * Math.random(), planet };
}
/**
 * Shoots all turrets towards player
 * @param world The world
 * @param turrteList List of turrets
 * @param ship players ship
 */
export function shootTurrets(world, turrteList, ship) {
    while (!is_null(turrteList)) {
        const turret = head(turrteList);
        if (turret.cooldown <= 0) {
            const x_dist = (get_x(ship) - get_x(turret));
            const y_dist = (get_y(ship) - get_y(turret));
            const dist = Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist, 2));
            if (dist < turretRange) {
                const currentChunk = getChunk(world, calc_chunkX(get_x(turret)), calc_chunkY(get_y(turret)));
                let angle = Math.acos(x_dist / dist);
                if (y_dist / dist < 0) {
                    angle *= -1;
                }
                if (currentChunk != undefined) {
                    spawnBullet(currentChunk, get_x(turret), get_y(turret), angle, false);
                }
            }
            turret.cooldown = turretCooldown;
        }
        else {
            turret.cooldown--;
        }
        turrteList = tail(turrteList);
    }
}
/**
 * @param planetList the planets turrets
 * @returns list of turrets
 */
export function gatherTurretList(planetList) {
    let turretList = null;
    while (!is_null(planetList)) {
        const planet = head(planetList);
        turretList = append(planet.turrets, turretList);
        planetList = tail(planetList);
    }
    return turretList;
}
/**
 * Creates a basic turret to a given planet (((((WIP)))))
 * @param planet the planet the turret is tied to
 * @returns the planet with the added turret
 */
export function addTurretToPlanet(planet) {
    function randomXYOnPlanetSurface(planet) {
        const randomRad = Math.random() * Math.PI * 2;
        const x = get_x(planet) + (planet.radius + 1) * Math.cos(randomRad);
        //chooses a random x within the planet's diameter
        const y = get_y(planet) + (planet.radius + 1) * Math.sin(randomRad);
        //chooses a random y within the planet's diameter
        return pair(x, y);
    }
    const x_y = randomXYOnPlanetSurface(planet);
    const turret = createTurret(head(x_y), tail(x_y), planet);
    planet.turrets = pair(turret, planet.turrets);
    return planet;
}
/**
 * Generates the world around the player
 * @param world the world
 * @param x the players chunks x
 * @param y the players chunks y
 */
export function generatePlayerWorld(world, x, y) {
    let undefindChunks = gatherUndefinedChunks(world, x, y);
    while (!is_null(undefindChunks)) {
        const chunk = head(undefindChunks);
        const chunkX = head(chunk);
        const chunkY = tail(chunk);
        world[chunkX + "," + chunkY] = generateChunk(world, chunkX, chunkY);
        undefindChunks = tail(undefindChunks);
    }
}
export function removeTurret(turret, world) {
    const planet = turret.planet;
    planet.turrets = remove(turret, planet.turrets);
    if (is_null(planet.turrets)) {
        blowUpPlanet(planet, world);
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
 * @returns a chunk
 */
export function generateChunk(world, x, y) {
    const currentChunk = getChunk(world, x, y);
    if (currentChunk === undefined) {
        const surroundingPlanets = gatherPlanetList(world, x, y);
        return { planets: generatePlanetList(surroundingPlanets, x * chunkSize, y * chunkSize),
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
 * @returns a list of planets that do not collide with eachother
 */
function generatePlanetList(planets, xOffset, yOffset) {
    let planetList = null;
    for (let i = amount; i > 0; i--) {
        const planet = createPlanet(Math.random() * (maxSize - minSize) + minSize, Math.random() * chunkSize + xOffset, Math.random() * chunkSize + yOffset);
        if (minDistCollisionForEach(planet, planets, minDist) >= 0 || minDistCollisionForEach(planet, planetList, minDist) >= 0) {
            i++;
            continue;
        }
        planetList = pair(planet, planetList);
    }
    return planetList;
}
//destoys a planet
export function blowUpPlanet(planet, world) {
    const chunk = getChunk(world, get_chunkX(planet), get_chunkY(planet));
    if (chunk != undefined) {
        playerShip.score++;
        chunk.planets = remove(planet, chunk.planets);
    }
}
//Gets the chunk of x, y
export function getChunk(world, x, y) {
    return world[x + "," + y];
}
