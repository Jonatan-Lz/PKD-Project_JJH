export function createMap() {
    let a = [[]];
    for (let y = 0; y < 10; y++) {
        let b = [];
        for (let x = 0; x < 30; x++) {
            b.push(" ");
        }
        a.push(b);
    }
    return a;
}
function clearMap(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x] = "_";
        }
    }
}
export function printer(map) {
    let a = "";
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            a = a + map[y][x];
        }
        a = a + "<br>";
    }
    return a;
}
function createCircle(map, rad, x, y) {
    for (let y1 = 0; y1 < map.length; y1++) {
        for (let x1 = 0; x1 < map[y1].length; x1++) {
            if (Math.sqrt((Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2))) <= rad) {
                map[y1][x1] = "O";
            }
        }
    }
}
export function drawMap(map, x1, y1, r, x, y) {
    clearMap(map);
    createCircle(map, r, x1 + x, y1 + y);
}
const map = createMap();
createCircle(map, 4.2, 3.5, 1.5);
createCircle(map, 2, -5, 3);
printer(map);
