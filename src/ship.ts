import { ship } from "./types.js";
import { pair } from "../lib/list.js";

/**
 * Creates and returns a ship with given parameters:
 * @param hitboxRad hitbox radius
 * @param x x-coordinate of ship
 * @param y y-coordinate of ship
 * @param sprite sprite of ship
 * @param hp health of ship
 * @returns created ship
 */
export function createShip(hitboxRad: number, x: number, y: number, sprite: string, hp: number): ship{
    return {tag: "ship", 
            gameObject: 
                {color: null, location: pair(x, y), hitbox: hitboxRad, 
                rotAngle: 0, hp: hp, sprite: sprite},
                xVel: 0, yVel: 0};
}

//checks velocity and changes ship sprite depending on it
//(this function looks so incredibly bad)
//((how the fuck do i make switch cases with two variables????))
export function ship_rotation_sprite(ship: ship): void {
    const xVel: number = ship.xVel;
    const yVel: number = ship.yVel;
    let sprite: string = "";
    if(xVel > 0) {
        if(yVel > 0) {
            sprite = "&seArr;"
        } else if (yVel < 0) {
            sprite = "&neArr;"
        } else if(yVel === 0){
            sprite = "&rArr;"
        } else { }
    } else if(xVel < 0){
        if(yVel > 0) {
            sprite = "&swArr;"
        } else if (yVel < 0) {
            sprite = "&nwArr;"
        } else if(yVel === 0){
            sprite = "&lArr;"
        } else { }
    } else if(xVel === 0) {
        if(yVel > 0) {
            sprite = "&dArr;"
        } else if(yVel < 0) {
            sprite = "&uArr;"
        } else if(xVel === 0){
            sprite = "&star;"
        } else { }
    }
    ship.gameObject.sprite = sprite;
}