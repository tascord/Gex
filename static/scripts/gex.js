let width = 100, height = 100;
let scale = 40;

let img;
let canvas;

let paused = false;
let started = false;
let completed = false;

let gex = 0;
let time = 0;

function setup() {
    canvas = createCanvas(width * scale, height * scale);    
}

function preload() {
    img = loadImage('./images/gex.png');
}

let index = 0;
let ring = 1;

async function draw_loop() {

    for (let i_y = -ring + 1; i_y - 1 < ring; i_y++) {
        for (let i_x = -ring + 1; i_x - 1 < ring; i_x++) {

            if(paused) await (() => new Promise((resolve) => {
                let _ = setInterval(() => {
                    if(!paused) {
                        resolve();
                        clearInterval(_);
                    }
                }, 250);
            }))();

            let x = ((scale / 2) - i_x) * width;
            let y = ((scale / 2) - i_y) * height;

            if (i_x != ring && i_x != -ring + 1 && i_y != ring && i_y != -ring + 1) continue;

            image(img, x, y, width, height);
            gex++;

            continue;

            // Draw Box
            noStroke();
            fill(ring * 20);
            rect(x, y, width, height);


            // Debug Text
            fill('blue')
            textAlign(CENTER);
            textSize(10)
            text(`${i_x},${i_y}`, x + (width / 2), y + 20)
            fill('green')
            text(`${ring}`, x + (width / 2), y + 30)



        }
    }

    if (++ring > (scale / 2) + 1) {
        completed = true;
        alert('Filled canvas.');
    };


}

const save = () => {
    if (!canvas) return alert('No canvas.');
    if (!started) return alert('Nothing to save.');
    saveCanvas(canvas, `GEX-${scale}x${scale}`, 'png');
}

const start = async() => {

    if(started) return;
    scale = scale.value || 10;

    started = true;
    completed = false;

    time = Date.now();

    while(!completed) await draw_loop();

}

setInterval(() => {

    if(!started) return;
    stats.gps.innerText = (gex / ((Date.now() - time) / 1000)).toFixed(1);

}, 250);