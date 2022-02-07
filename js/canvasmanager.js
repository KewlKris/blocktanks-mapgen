import {TileMap, Tile} from './tilemap.js';

const IMAGE_URLS = {
    'fence': './assets/fence.png',
    'ffa_spawn': './assets/spawn.png'
};

const TILE_SIZE = 100;

class CanvasManager {
    /** @type {HTMLCanvasElement} */
    #mainCanvas;

    /** @type {HTMLCanvasElement} */
    #mapCanvas;

    /** @type {HTMLCanvasElement} */
    #computationCanvas;

    /** @type {Object.<String, HTMLImageElement>} */
    #images;

    /** @type {Number} */
    #width;

    /** @type {Number} */
    #height;

    /**
     * The current TileMap
     * @type {TileMap}
     */
    #map;

    /**
     * Initialize a new CanvasManager
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
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
    setMap(map) {
        this.#map = map;
    }

    /**
     * Resize the main canvas to fit its css appearance
     */
    updateCanvasSize() {
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
    updateInternalCanvasDimensions() {
        [this.#mapCanvas, this.#computationCanvas].forEach(canvas => {
            canvas.setAttribute('width', this.#map.getWidth() * TILE_SIZE);
            canvas.setAttribute('height', this.#map.getHeight() * TILE_SIZE);
        });
    }

    /**
     * Update the main canvas to show the current state of a TileMap
     */
    drawMap() {
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
    drawTile(tile) {
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

    /**
     * Copy the map and computation canvases to the main canvas
     */
    updateMainCanvas() {
        let ctx = this.#mainCanvas.getContext('2d');

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
        [this.#mapCanvas, this.#computationCanvas].forEach(canvas => {
            ctx.drawImage(canvas, 0, 0, tileWidth * TILE_SIZE, tileHeight * TILE_SIZE, (this.#width / 2) - (drawnWidth / 2), (this.#height / 2) - (drawnHeight / 2), drawnWidth, drawnHeight);
        });
    }
    
    /**
     * Load all required assets asynchronously
     * @async
     */
    async loadImages() {
        let promises = Object.keys(IMAGE_URLS).map(key => {
            return new Promise((resolve, reject) => {
                let img = document.createElement('img');
                img.addEventListener('load', () => {
                    this.#images[key] = img;
                    resolve();
                });
                img.addEventListener('error', () => reject());
            });
        });

        await Promise.all(promises);
    }

    /**
     * Clear the map canvas
     */
    clearMapCanvas() {
        this.#clearCanvas(this.#mapCanvas);
    }

    /**
     * Clear the computation canvas
     */
    clearComputationCanvas() {
        this.#clearCanvas(this.#computationCanvas);
    }

    /**
     * Clear a canvas
     * @param {HTMLCanvasElement} canvas
     */
     #clearCanvas(canvas) {
        let tileWidth = this.#map.getWidth();
        let tileHeight = this.#map.getHeight();

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, tileWidth * TILE_SIZE, tileHeight * TILE_SIZE);
    }
}

export default CanvasManager;