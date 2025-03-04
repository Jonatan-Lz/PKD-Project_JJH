import { get_x, get_y } from "./types.js";
import { pair, list, append, head, tail } from "../lib/list.js";
/**
 * Creates and returns a planet
 * @param radius radius of planet
 * @param x x-coordinate of planet
 * @param y y-coordinate of planet
 * @returns created planet
 */
export function createPlanet(radius, x, y) {
    return {
        tag: "planet",
        gameObject: { color: null,
            location: pair(x, y),
            hitbox: radius,
            rotAngle: 0,
            hp: 1,
            sprite: "O" },
        radius: radius,
        turrets: list(null)
    };
}
// a basic turret at 0, 0
export const basicTurret = {
    tag: "turret",
    gameObject: { color: null,
        location: pair(0, 0),
        hitbox: 1,
        rotAngle: 0,
        hp: 1,
        sprite: "X" },
};
/**
 * Creates a basic turret to a given planet
 * @param planet the planet the turret is tied to
 * @returns the planet with the added turret
 */
export function addTurretToPlanet(planet) {
    var turret = basicTurret;
    function randomXYOnPlanetSurface(planet) {
        const x = head(planet.gameObject.location) - planet.radius + Math.floor(Math.random() * 2 * planet.radius + 1); //chooses a random x within the planet's diameter
        // (x - a)^2 + (y - b)^2 = r^2    ==>    sqrt((y - b)^2) = sqrt(r^2 - (x - a)^2)    ==>    y = sqrt(r^2 - (x - a)^2) - b
        let y = Math.sqrt(Math.pow(planet.radius, 2) - Math.pow((x - head(planet.gameObject.location)), 2)) - tail(planet.gameObject.location); // y calculated through (x - a)^2 + (y - b)^2 = r^2 
        //if (Math.random() < 0.5) {y = -y} else {} // 50% to make y negative for +- from taking square root
        return pair(x, y);
    }
    //turret.gameObject.location = randomXYOnPlanetSurface(planet);
    turret.gameObject.location = pair(get_x(planet) + planet.radius + 1, get_y(planet)); //temp test
    planet.turrets = append(planet.turrets, list(turret));
    return planet;
}
