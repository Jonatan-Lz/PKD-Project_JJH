import { ship } from "./types.js";
import { pair } from "../lib/list.js";

export function createShip(hitboxRad: number, x: number, y: number, sprite: string, hp: number): ship{
    return {tag: "ship", 
            gameObject: 
                {color: null, location: pair(x, y), hitbox: hitboxRad, 
                rotAngle: 0, hp: hp, sprite: sprite},
                xVel: 0, yVel: 0};
}