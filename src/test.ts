export function createMap(): Array<Array<any>>{
    let a: Array<Array<any>> = [[]];
    for(let y = 0; y < 10; y++){
        let b: Array<any> = [];
        for(let x = 0; x < 30; x++){
            b.push(" ");
        }
        a.push(b);
    }
    return a;
}
function clearMap(map: Array<Array<any>>): void{
    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            map[y][x] = "_";
        }
    }
}
export function printer(map: Array<Array<any>>): string{
    let a = "";
    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            a = a + map[y][x];
        }
        a = a + "<br>";
    }
    return a;
} 
function createCircle(map: Array<Array<any>>, rad: number, x: number, y: number): void{
    for(let y1 = 0; y1 < map.length; y1++){
        for(let x1 = 0; x1 < map[y1].length; x1++){
            if(Math.sqrt(((x1 - x)**2 + (y1 - y)**2)) <= rad){
                map[y1][x1] = "O"
            }
        }
    }
}
export function drawMap(map: Array<Array<any>>, x1:number, y1:number, r:number, x:number, y:number){
    clearMap(map);
    createCircle(map, r, x1 + x, y1 + y);
}
const map = createMap();
createCircle(map, 4.2, 3.5, 1.5);
createCircle(map, 2, -5, 3);
printer(map);