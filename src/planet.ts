import {planet} from "./types.js";
import {pair} from "../lib/list.js";

export function createPlanet(radius: number, x: number, y: number): planet{
    return {tag: "planet", gameObject: 
               {color: null, 
                location: pair(x, y), 
                hitbox: radius, 
                rotAngle: 0, 
                hp: 1, 
                sprite: "O"}, 
            radius: radius};
}