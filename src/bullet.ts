import { append, for_each, head, is_null, List, pair, remove, tail } from "../lib/list.js"
import { collision, get_chunkY, get_chunkX as get_chunkX, get_x, get_y, calc_chunkY, calc_chunkX, createGameobject, change_location } from "./generalFunction.js";
import { getChunk } from "./planet.js";
import { bullet, chunk, world, chunkSize, generalObject} from "./types.js";

const liftime = 100;
const speed = 1; // bullet speed
const bulletDamage = 1;

export function moveAll(world: world, bulletList: List<bullet>): void{
    while(!is_null(bulletList)){
        const bullet = head(bulletList);
        moveBullet(world, bullet);
        bulletList = tail(bulletList);
    }
}

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

export function spawnBullet(chunk: chunk, x: number, y: number, angle: number, friendly: boolean): void{
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newBullet = createBullet(x, y, cos * speed, sin * speed, "*", friendly)
    chunk.bullets = pair(newBullet, chunk.bullets);
}

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

export function changeBulletChunk(world: world, bullet: bullet): void{
    removeBullet(world, bullet);
    addBullet(world, bullet)
}

export function removeBullet(world: world, bullet: bullet): void{
    const chunk = getChunk(world, get_chunkX(bullet), get_chunkY(bullet));
    if(chunk != undefined){
        chunk.bullets = remove(bullet, chunk.bullets);
    }
}

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