/**
 * @typedef {import('./tilemap.js').default} TileMap
 * @typedef {import('./tile.js').default} Tile
 */

const IMAGE_URLS = {
    'fence': './assets/fence.png',
    'ffa_spawn': './assets/spawn.png'
};

const TILE_SIZE = 100;
const COMPUTATION_ALPHA = 0.5;

class CanvasManager {
    /** @type {HTMLCanvasElement} */
    static #mainCanvas;

    /** @type {HTMLCanvasElement} */
    static #mapCanvas;

    /** @type {HTMLCanvasElement} */
    static #computationCanvas;

    /** @type {Object.<String, HTMLImageElement>} */
    static #images;

    /** @type {Number} */
    static #width;

    /** @type {Number} */
    static #height;

    /**
     * The current TileMap
     * @type {TileMap}
     */
    static #map;

    /**
     * Initialize the CanvasManager
     * @param {HTMLCanvasElement} canvas 
     */
    static initialize(canvas) {
        this.#images = {};
        this.#mainCanvas = canvas;
        this.#mapCanvas = document.createElement('canvas');
        this.#computationCanvas = document.createElement('canvas');

        window.addEventListener('resize', () => this.updateCanvasSize());
        this.updateCanvasSize();
    }

    /**
     * Set the currently displayed TileMap
     * @param {TileMap} map 
     */
    static setMap(map) {
        this.#map = map;
    }

    /**
     * Resize the main canvas to fit its css appearance
     */
    static updateCanvasSize() {
        let {width, height} = this.#mainCanvas.getBoundingClientRect();
        this.#width = width;
        this.#height = height;
        this.#mainCanvas.setAttribute('width', width);
        this.#mainCanvas.setAttribute('height', height);

        if (this.#map) {
            this.updateMainCanvas();
        }
    }

    /**
     * Update the dimensions of the internal canvases
     */
    static updateInternalCanvasDimensions() {
        [this.#mapCanvas, this.#computationCanvas].forEach(canvas => {
            canvas.setAttribute('width', this.#map.getWidth() * TILE_SIZE);
            canvas.setAttribute('height', this.#map.getHeight() * TILE_SIZE);
        });
    }

    /**
     * Update the map canvas to show the current state of a TileMap
     */
    static drawMap() {
        let tileWidth = this.#map.getWidth();
        let tileHeight = this.#map.getHeight();

        this.updateInternalCanvasDimensions();
        this.clearMapCanvas();
        this.clearComputationCanvas();

        for (let y=0; y<tileHeight; y++) {
            for (let x=0; x<tileWidth; x++) {
                let tile = this.#map.getTile(x, y);
                this.drawTile(tile);
            }
        }
    }

    /**
     * Draw a tile onto the map canvas
     * @param {Tile} tile 
     */
    static drawTile(tile) {
        let {x, y} = tile.getCoords();
        x *= TILE_SIZE;
        y *= TILE_SIZE;

        let ctx = this.#mapCanvas.getContext('2d');

        // Draw the tile type
        switch (tile.getType()) {
            case 'empty':
                ctx.clearRect(x, y, TILE_SIZE, TILE_SIZE);
                break;
            case 'wall':
                ctx.fillStyle = '#b4b4b4';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                break;
            case 'fence':
                ctx.drawImage(this.#images['fence'], x, y, TILE_SIZE, TILE_SIZE)
                break;
        }

        // Draw tile properties
        if (tile.hasProperty('roof')) {
            ctx.fillStyle = '#232323';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
        if (tile.hasProperty('ffa_spawn')) {
            ctx.drawImage(this.#images['ffa_spawn'], x, y, TILE_SIZE, TILE_SIZE);
        }
        if (tile.hasProperty('weapon_spawn')) {
            ctx.fillStyle = 'black';
            ctx.font = `${TILE_SIZE}px 'Passion One'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('!', x + (TILE_SIZE / 2), y + (TILE_SIZE / 2));
        }
    }

    static drawComputation(x, y, fillStyle) {
        let ctx = this.#computationCanvas.getContext('2d');

        ctx.globalAlpha = COMPUTATION_ALPHA;
        ctx.fillStyle = fillStyle;
        ctx.clearRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    /**
     * Copy the map and computation canvases to the main canvas
     */
    static updateMainCanvas() {
        let ctx = this.#mainCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.#width, this.#height);

        let tileWidth = this.#map.getWidth();
        let tileHeight = this.#map.getHeight();

        let tileScale;
        if (tileWidth > tileHeight) {
            // Map is wide
            tileScale = (this.#width / (tileWidth * TILE_SIZE));
        } else {
            // Map is tall or square
            tileScale = (this.#height / (tileHeight * TILE_SIZE));
        }

        let drawnWidth = tileWidth * TILE_SIZE * tileScale;
        let drawnHeight = tileHeight * TILE_SIZE * tileScale;
        let x = (this.#width / 2) - (drawnWidth / 2);
        let y = (this.#height / 2) - (drawnHeight / 2);

        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, drawnWidth, drawnHeight); // Draw the background

        // Draw each canvas
        [this.#mapCanvas, this.#computationCanvas].forEach(canvas => {
            ctx.drawImage(canvas, 0, 0, tileWidth * TILE_SIZE, tileHeight * TILE_SIZE, x, y, drawnWidth, drawnHeight);
        });
    }
    
    /**
     * Load all required assets asynchronously
     * @async
     */
    static async loadImages() {
        let promises = Object.keys(IMAGE_URLS).map(key => {
            return new Promise((resolve, reject) => {
                let img = document.createElement('img');
                img.addEventListener('load', () => {
                    this.#images[key] = img;
                    resolve();
                });
                img.addEventListener('error', () => reject());
                img.src = IMAGE_URLS[key];
            });
        });

        await Promise.all(promises);
    }

    /**
     * Clear the map canvas
     */
    static clearMapCanvas() {
        this.#clearCanvas(this.#mapCanvas);
    }

    /**
     * Clear the computation canvas
     */
    static clearComputationCanvas() {
        this.#clearCanvas(this.#computationCanvas);
    }

    /**
     * Clear a canvas
     * @param {HTMLCanvasElement} canvas
     */
     static #clearCanvas(canvas) {
        let tileWidth = this.#map.getWidth();
        let tileHeight = this.#map.getHeight();

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, tileWidth * TILE_SIZE, tileHeight * TILE_SIZE);
    }
}

export default CanvasManager;