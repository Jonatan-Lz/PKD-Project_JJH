import { createMap, drawMap, printer } from "./test.js";
let x = 0;
let y = 0;
const a = createMap();
function handleKeyEvent(event) {
    const key = event.key;
    if (key === "d") {
        x++;
    }
    else if (key === "a") {
        x--;
    }
    else if (key === "w") {
        y++;
    }
    else if (key === "s") {
        y--;
    }
    drawMap(a, 5, 5, 2, x, y);
    const output = document.getElementById('output');
    output.innerHTML = printer(a);
}
document.addEventListener('keydown', handleKeyEvent);
