import { pair } from "../lib/list.js";
export function createPlanet(radius, x, y) {
    return { tag: "planet",
        gameObject: { color: null, location: pair(x, y), hitbox: radius, rotaAngle: 0, hp: 1, sprite: "O" },
        radius: radius };
}
