import { append, for_each, head, is_null, List, pair, remove, tail } from "../lib/list.js"
import { collision } from "./generalFunction.js";
import { getChunk } from "./planet.js";
import { bullet, change_location, chunk, chunks, chunkSize, chunkX, chunkY, createGameobject, generalObject, get_chunkY, get_chunX as get_chunkX, get_x, get_y } from "./types.js";

const liftime = 100;

export function moveAll(world: chunks, bulletList: List<bullet>): void{
    while(!is_null(bulletList)){
        const bullet = head(bulletList);
        moveBullet(world, bullet);
        bulletList = tail(bulletList);
    }
}

function moveBullet(world: chunks, bullet: bullet): void{
    const location = bullet.gameObject.location;
    const newX = head(location) + bullet.xVel;
    const newY = tail(location) + bullet.yVel;
    change_location(bullet, newX, newY);
    bullet.lifeTime--;
    if(bullet.lifeTime <= 0){
        removeBullet(world, bullet);
    } else if(chunkX(newX) != get_chunkX(bullet) || chunkY(newY) != get_chunkY(bullet)){
        changeBulletChunk(world, bullet);
    }
}

export function spawnBullet(chunk: chunk, x: number, y: number, angle: number, speed: number, enemy: boolean): void{
    const newBullet = createBullet(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, "*", enemy)
    chunk.bullets = pair(newBullet, chunk.bullets);
}

function createBullet(x:number, y:number, xVel:number, yVel:number, sprite:string, enemy: boolean): bullet{
    return {tag: "bullet", team: enemy,
            gameObject: createGameobject(x, y, 0.5, 1, "*"), 
            xVel: xVel, yVel:yVel, lifeTime: liftime}
}

/**
 * Gathers all bullets in the surrounding chunks 3x3 around the current
 * @param world the world
 * @param x current chunk x
 * @param y current chunk y
 * @returns list of bullets
 */
export function gatherBulletList(world: chunks, x: number, y: number): List<bullet>{
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

export function changeBulletChunk(world: chunks, bullet: bullet): void{
    removeBullet(world, bullet);
    addBullet(world, bullet)
}

export function removeBullet(world: chunks, bullet: bullet): void{
    const chunk = getChunk(world, get_chunkX(bullet), get_chunkY(bullet));
    if(chunk != undefined){
        chunk.bullets = remove(bullet, chunk.bullets);
    }
}

export function addBullet(world: chunks, bullet: bullet): void{
    const newChunkX = chunkX(get_x(bullet));
    const newChunkY = chunkY(get_y(bullet));
    const chunk = getChunk(world, newChunkX, newChunkY);
    bullet.gameObject.chunkX = newChunkX;
    bullet.gameObject.chunkY = newChunkY;
    if(chunk != undefined){
        chunk.bullets = pair(bullet, chunk.bullets);
    }
}