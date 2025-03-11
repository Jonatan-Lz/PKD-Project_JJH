import { append, for_each, head, is_null, List, pair, remove, tail } from "../lib/list.js"
import { collision, get_chunkY, get_chunkX as get_chunkX, get_x, get_y, calc_chunkY, calc_chunkX, createGameobject, change_location } from "./generalFunction.js";
import { getChunk } from "./planet.js";
import { bullet, chunk, world, chunkSize, generalObject} from "./types.js";

const liftime = 100;
const speed = 1; // bullet speed
const bulletDamage = 1;

/**
 * Moves bullets in designated world
 * @param world World to move objects in
 * @param bulletList Bullets to move
 */
export function moveAll(world: world, bulletList: List<bullet>): void{
    while(!is_null(bulletList)){
        const bullet = head(bulletList);
        moveBullet(world, bullet);
        bulletList = tail(bulletList);
    }
}

/**
 * Calculates and moves a bullet in a world
 * @param world World to move bullet in
 * @param bullet Designated bullet to move
 */
function moveBullet(world: world, bullet: bullet): void{
    const newX = get_x(bullet) + bullet.xVel;
    const newY = get_y(bullet) + bullet.yVel;
    change_location(bullet, newX, newY);
    bullet.lifeTime--;
    if(bullet.lifeTime <= 0){
        removeBullet(world, bullet);
    }
    if(calc_chunkX(newX) != get_chunkX(bullet) || calc_chunkY(newY) != get_chunkY(bullet)){
        changeBulletChunk(world, bullet);
    }
}

/**
 * Spawns a bullet in a chunk
 * @param chunk Chunk to spawn bullet in
 * @param x x - coordinate of bullet
 * @param y y - coordinate of bullet
 * @param angle What angle the bullets going
 * @param friendly If its on your team or not (true if on your team)
 */
export function spawnBullet(chunk: chunk, x: number, y: number, angle: number, friendly: boolean): void{
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newBullet = createBullet(x, y, cos * speed, sin * speed, "*", friendly)
    chunk.bullets = pair(newBullet, chunk.bullets);
}

/**
 * Creates and returns a bullet
 * @param x x - coordinate of bullet
 * @param y y - coordinate of bullet
 * @param xVel x - velocity of bullet
 * @param yVel y - velocity of bullet
 * @param sprite sprite of bullet
 * @param enemy if its an enemy or not
 * @returns {bullet} bullet
 */
function createBullet(x:number, y:number, xVel:number, yVel:number, sprite:string, enemy: boolean): bullet{
    return {tag: "bullet", friendly: enemy,
            gameObject: createGameobject(x, y, 0.2, bulletDamage, "*"), 
            xVel: xVel, yVel:yVel, lifeTime: liftime}
}

/**
 * Gathers all bullets in the surrounding chunks 3x3 around the current
 * @param world the world
 * @param x current chunk x
 * @param y current chunk y
 * @returns list of bullets
 */
export function gatherBulletList(world: world, x: number, y: number): List<bullet>{
    let bulletList = null;
    for(let chunkX = -1; chunkX <= 1; chunkX++){
        for(let chunkY = -1; chunkY <= 1; chunkY++){
            const chunk = getChunk(world, x + chunkX, y + chunkY);
            if(chunk != undefined){
                bulletList = append(bulletList, chunk.bullets);
            }
        }
    }
    return bulletList;
}

/**
 * Changes the chunk of a bullet
 * @param world World to change the bullets chunk in
 * @param bullet bullet to change chunk
 */
export function changeBulletChunk(world: world, bullet: bullet): void{
    removeBullet(world, bullet);
    addBullet(world, bullet)
}

/**
 * deletes a bullet from a world
 * @param world world that bullets in
 * @param bullet designated bullet
 */
export function removeBullet(world: world, bullet: bullet): void{
    const chunk = getChunk(world, get_chunkX(bullet), get_chunkY(bullet));
    if(chunk != undefined){
        chunk.bullets = remove(bullet, chunk.bullets);
    }
}

/**
 * Adds a bullet into a world
 * @param world world to add bullet into
 * @param bullet bullet to add
 */
export function addBullet(world: world, bullet: bullet): void{
    const newChunkX = calc_chunkX(get_x(bullet));
    const newChunkY = calc_chunkY(get_y(bullet));
    const chunk = getChunk(world, newChunkX, newChunkY);
    bullet.gameObject.chunkX = newChunkX;
    bullet.gameObject.chunkY = newChunkY;
    if(chunk != undefined){
        chunk.bullets = pair(bullet, chunk.bullets);
    }
}