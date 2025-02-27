import { pair } from "../lib/list.js";
export function createShip(hitboxRad, x, y, sprite, hp) {
    return { tag: "ship",
        gameObject: { color: null, location: pair(x, y), hitbox: hitboxRad,
            rotaAngle: 0, hp: hp, sprite: sprite },
        xVel: 0,
        yVel: 0 };
}
