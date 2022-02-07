class TileMap {
    /** @type {Number} */
    #width;

    /** @type {Number} */
    #height;

    /** @type {Tile[][]} */
    #tileMap;

    /**
     * Initialize a new TileMap
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height) {
        // Initialize the tile map
        this.#tileMap = [];
        for (let y=0; y<height; y++) {
            let row = [];
            for (let x=0; x<width; x++) {
                let tileType = (x == 0 || x == width - 1 || y == 0 || y == height - 1) ? 'wall' : 'empty';
                let tile = new Tile(this, tileType, x, y);
                if (tileType == 'wall') tile.addProperty('immutable');
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

class Tile {
    /**
     * @typedef {'empty' | 'wall' | 'fence'} TileType
     */

    /**
     * @typedef {{x: Number, y: Number}} TileCoordinates
     */

    /** @type {TileType} */
    #tileType;

    /** @type {String[]} */
    #properties;

    /** @type {TileMap} */
    #map;

    /** @type {TileCoordinates} */
    #coords;

    /**
     * Initialize a new Tile
     * @param {TileMap} map
     * @param {TileType} tileType
     * @param {Number} x
     * @param {Number} y 
     */
    constructor(map, tileType, x, y) {
        this.#map = map;
        this.#tileType = tileType;
        this.#properties = [];
        this.#coords = {x, y};
        
        this.addProperty('untouched'); // Mark all tiles as untouched when created
    }

    /**
     * Add a property to this Tile
     * @param {String} property 
     */
    addProperty(property) {
        if (this.#properties.indexOf(property) == -1) {
            this.#properties.push(property);
        }
    }

    /**
     * Check whether this Tile has the given property
     * @param {String} property 
     * @returns {Boolean}
     */
    hasProperty(property) {
        return (this.#properties.indexOf(property) != -1);
    }

    /**
     * Remove a property from this Tile
     * @param {String} property 
     */
    removeProperty(property) {
        let index = this.#properties.indexOf(property);
        if (index != -1) {
            this.#properties.splice(index, 1);
        }
    }

    /**
     * Change the Tile's type
     * @param {TileType} tileType 
     */
    setType(tileType) {
        this.#tileType = tileType;
        this.removeProperty('untouched');
    }

    /**
     * Get the Tile's type
     * @returns {TileType}
     */
    getType() {
        return this.#tileType;
    }

    /**
     * Get the Tile's coordinates on the map
     * @returns {TileCoordinates}
     */
    getCoords() {
        return this.#coords;
    }

    get tileLeft() {
        return this.#getTileFromOffset(-1, 0);
    }

    get TileRight() {
        return this.#getTileFromOffset(1, 0);
    }

    get tileAbove() {
        return this.#getTileFromOffset(0, -1);
    }

    get tileBelow() {
        return this.#getTileFromOffset(0, 1);
    }

    get tileTopLeft() {
        return this.#getTileFromOffset(-1, -1);
    }

    get tileTopRight() {
        return this.#getTileFromOffset(1, -1);
    }

    get tileBottomLeft() {
        return this.#getTileFromOffset(-1, 1);
    }

    get tileBottomRight() {
        return this.#getTileFromOffset(1, 1);
    }

    /**
     * Get the Tile which is at an offset from this one
     * @param {Number} xOffset 
     * @param {Number} yOffset 
     * @returns {Tile | Undefined}
     */
    #getTileFromOffset(xOffset, yOffset) {
        let {x, y} = this.#coords;
        x += xOffset;
        y += yOffset;

        let width = this.#map.getWidth();
        let height = this.#map.getHeight();

        if (x < 0 || x >= width || y < 0 || y >= height) {
            // Out of range!
            return undefined;
        }

        return this.#map.getTile(x, y);
    }
}

export default TileMap;