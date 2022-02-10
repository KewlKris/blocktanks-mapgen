import Tile from './tile.js';
import TileMapAnimation from './tilemapanimation.js';

class TileMap {
    /**
     * Overwrite: Replace any tile, Overlay: Replace empty tiles, Clear: Set to empty
     * @typedef {'overwrite' | 'overlay' | 'clear'} BlendMode
     */

    /**
     * @typedef {'none' | 'x' | 'y' | 'xy' | 'radial'} TileMapSymmetry
     */

    /** @type {Number} */
    #width;

    /** @type {Number} */
    #height;

    /** @type {Tile[][]} */
    #tileMap;

    /** @type {BlendMode} */
    #blendMode;

    /** @type {TileMapSymmetry} */
    #symmetry;

    /** @type {Number} */
    #symmetryPoints;

    /** @type {TileMapAnimation} */
    animation;

    /**
     * Initialize a new TileMap
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height) {
        this.#width = width;
        this.#height = height;
        this.animation = new TileMapAnimation();
        this.setBlendMode('overwrite');
        this.setSymmetry('none');

        // Initialize the tile map
        this.#tileMap = [];
        for (let y=0; y<height; y++) {
            let row = [];
            for (let x=0; x<width; x++) {
                let tileType = (x == 0 || x == width - 1 || y == 0 || y == height - 1) ? 'wall' : 'empty';
                let tile = new Tile(this, tileType, x, y);
                if (tileType == 'wall') tile.addProperty('immutable');
                tile.setRecordable(true);
                row.push(tile);
            }
            this.#tileMap.push(row);
        }
    }

    /**
     * Get the Tile at these coordinates
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Tile}
     */
    getTile(x, y) {
        return this.#tileMap[y][x];
    }

    /**
     * Add this Tile to the TileMap and remove the previous Tile in its place
     * @param {Tile} tile 
     */
    addTile(tile) {
        let {x, y} = tile.getCoords();
        this.#tileMap[y][x] = tile;

        this.animation.logTileUpdate(tile);
    }

    /**
     * Get all tiles in the map with the given type
     * @param {TileType} tileType 
     * @returns {Tile[]}
     */
    getTilesOfType(tileType) {
        let tileList = [];
        for (let y=0; y<this.#height; y++) {
            for (let x=0; x<this.#width; x++) {
                let tile = this.getTile(x, y);
                if (tile.getType() == tileType) tileList.push(tile);
            }
        }

        return tileList;
    }

    /**
     * Get the width of the TileMap
     * @returns {Number}
     */
    getWidth() {
        return this.#width;
    }

    /**
     * Get the height of the TileMap
     * @returns {Number}
     */
    getHeight() {
        return this.#height;
    }

    /**
     * Set the current blend mode for the TileMap
     * @param {BlendMode} mode 
     */
     setBlendMode(mode) {
        this.#blendMode = mode;
    }

    /**
     * Gets the current blend mode for the TileMap
     * @returns {BlendMode}
     */
    getBlendMode() {
        return this.#blendMode;
    }

    /**
     * Set the TileMap symmetry
     * @param {TileMapSymmetry} symmetry 
     * @param {Number} [points=1] - The radial symmetry points. Only needed if symmetry is set to 'radial'
     */
    setSymmetry(symmetry, points=1) {
        this.#symmetry = symmetry;
        this.#symmetryPoints = points;
    }

    /**
     * Get the TileMap symmetry
     * @returns {{symmetry: TileMapSymmetry, points: Number}}
     */
    getSymmetry() {
        return {
            symmetry: this.#symmetry,
            points: this.#symmetryPoints
        }
    }
}

export default TileMap;