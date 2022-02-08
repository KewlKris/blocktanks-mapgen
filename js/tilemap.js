import Tile from './tile.js';
import TileMapAnimation from './tilemapanimation.js';

class TileMap {
    /** @type {Number} */
    #width;

    /** @type {Number} */
    #height;

    /** @type {Tile[][]} */
    #tileMap;

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
}

export default TileMap;