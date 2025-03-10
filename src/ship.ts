import { keys_pressed, ship, screen } from "./types.js";
import { Pair, pair } from "../lib/list.js";
import { createGameobject, get_x, get_y } from "./generalFunction.js";
import { drawString } from "./drawScreen.js"
const accel = 0.022; //acceleration suggested 5% of maxVel
const deAccel = 0.018 //deacceleration suggested 4.5% of maxVel
const maxVel = 0.4
const minVel = 0.01 //when changing dir min value for complete switch in dir
// suggested 2.5% of maxVel (Shuold always be lower then accel)
const aimSpeed = 0.1;
const dirDeviation = 0.03 // acceptable range of deviation for sprite change
const hp = 4;

/**
 * Creates and returns a ship with given parameters:
 * @param hitboxRad hitbox radius
 * @param x x-coordinate of ship
 * @param y y-coordinate of ship
 * @param sprite sprite of ship
 * @param hp health of ship
 * @returns created ship
 */
export function createShip(hitboxRad: number, x: number, y: number, sprite: string): ship{
    return {tag: "ship", 
            gameObject: createGameobject(x, y, 0.5, hp, "A"),
            xVel: 0, yVel: 0, 
            score: 0};
}

/**
 * Changes velocity of ship based on input
 * @param dir the direction "a" = left, "d" = right
 *            "w" = up, "s" = down, "r" = slow down
 * @param ship the ship
 */
export function movement(keys: keys_pressed, ship: ship): void{
    let xVel = ship.xVel;
    let yVel = ship.yVel;
    if(keys.a){
        xVel = xVel - accel;
        normalizeMovement();
    }
    if(keys.d){
        xVel = xVel + accel;
        normalizeMovement();
    }
    if(keys.w){
        yVel = yVel - accel;
        normalizeMovement();
    }
    if(keys.s){
        yVel = yVel + accel;
        normalizeMovement();
    }
    if(keys.r){
        if(Math.abs(yVel) < minVel){
            yVel = 0;
        } else {
        yVel -= (yVel/Math.abs(yVel)) * deAccel;
        }
        if(Math.abs(xVel) < minVel){
            xVel = 0;
        } else {
        xVel -= (xVel/Math.abs(xVel)) * deAccel;
        }
        ship.xVel = xVel;
        ship.yVel = yVel;
    }
    function normalizeMovement(){
        let combinedVel = Math.sqrt(xVel**2 + yVel**2);
        if(combinedVel > maxVel){
            combinedVel = combinedVel/maxVel;
            ship.xVel = xVel/combinedVel;
            ship.yVel = yVel/combinedVel;
            if(Math.abs(ship.xVel) < minVel){
                ship.xVel = 0;
            }
            if(Math.abs(ship.yVel) < minVel){
                ship.yVel = 0;
            }
        } else {
            ship.xVel = xVel;
            ship.yVel = yVel;
        }
    }
}

//checks velocity and changes ship sprite depending on it
//(this function looks so incredibly bad)
//((how the fuck do i make switch cases with two variables????))
export function ship_rotation_sprite(ship: ship): void {
    const xVel: number = ship.xVel;
    const yVel: number = ship.yVel;
    let sprite: string = "";

    if(xVel > dirDeviation) {
        if(yVel > dirDeviation) {sprite = "&seArr;"} 
        else if (yVel < -dirDeviation) {sprite = "&neArr;"} 
        else {sprite = "&rArr;"}
    } else if(xVel < -dirDeviation){
        if(yVel > dirDeviation) {sprite = "&swArr;"}
        else if (yVel < -dirDeviation) {sprite = "&nwArr;"}
        else {sprite = "&lArr;"}
    } else {
        if(yVel > dirDeviation) {sprite = "&dArr;"}
        else if(yVel < -dirDeviation) {sprite = "&uArr;"}
        else {sprite = "&star;"}
    }
    ship.gameObject.sprite = sprite;
}

/**
 * Changes the direction the gun aims toward
 * @param keys currently pressed down keys
 * @param ship ship thats gonna aim
 */
export function aimShipTurret(keys: keys_pressed, ship: ship): void {
    if(keys.left){ship.gameObject.rotAngle -= aimSpeed}
    else if(keys.right){ship.gameObject.rotAngle += aimSpeed}
    if(ship.gameObject.rotAngle > Math.PI*2 || ship.gameObject.rotAngle < -Math.PI*2){
        ship.gameObject.rotAngle = 0;
    }
}