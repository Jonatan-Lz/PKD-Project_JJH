import { pair } from "../lib/list.js";
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
