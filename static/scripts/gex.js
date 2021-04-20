let width = 100, height = 100;
let scale = 100;

// let img = new Image();

let ready = true.;
let paused = false;
let started = false;
let completed = false;

let gex = 0;
let time = 0;
let since = 0;

let index = 0;
let ring = 1;

async function draw_loop() {

    let count = 0;

    for (let i_y = -ring + 1; i_y - 1 < ring; i_y++) {
        for (let i_x = -ring + 1; i_x - 1 < ring; i_x++) {

            if (paused) await (() => new Promise((resolve) => {
                let _ = setInterval(() => {
                    if (!paused) {
                        resolve();
                        clearInterval(_);
                    }
                }, 250);
            }))();

            let x = ((scale / 2) - i_x) * width;
            let y = ((scale / 2) - i_y) * height;

            if (i_x != ring && i_x != -ring + 1 && i_y != ring && i_y != -ring + 1) continue;

            count++;

            context.drawImage(img, x, y, width, height)
            gex++;

            continue;

        
        }

    }

    console.log(`[O] Ring ${ring} completed. ${count} Gex's drawn.`);

    if (++ring > (scale / 2) + 1) {
        completed = true;
        gex = 0;
    };


}

const save = () => {
    if (!canvas) return alert('No canvas.');
    if (!started) return alert('Nothing to save.');
    saveCanvas(canvas, `GEX-${scale}x${scale}`, 'png');
}

const start = async () => {

    if(!ready) return;
    if (started && !completed) return;

    scale = parseInt(scale_elem.value) || 10;
    if (isNaN(scale)) scale = 10;

    canvas.width = width * scale;
    canvas.height = height * scale;

    started = true;
    completed = false;

    rings = 1, gex = 0, since = 0;
    time = Date.now();

    let _ = setInterval(() => {
        if (completed) clearInterval(_);
        draw_loop();
    });

}

const range = (value, in_min, in_max, out_min, out_max) => {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const reset = () => location.reload();

setInterval(() => {

    stats.state.innerText = started ? completed ? 'Completed' : paused ? 'Paused' : 'Working...' : 'Idle'
    stats.percent.innerText = range(gex, 0, (scale * scale), 0, 100).toFixed(2) + '%';
    stats.rings.innerText = ring;

    if(completed) return;

    stats.gps.innerText = (gex - since) / 4;
    since = gex;

}, 250);