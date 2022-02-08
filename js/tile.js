/**
 * @typedef {import('./tilemap.js').default} TileMap
 */

class Tile {
    /**
     * @typedef {'empty' | 'wall' | 'fence'} TileType
     */

    /**
     * @typedef {{x: Number, y: Number}} TileCoordinates
     */

    /** @type {TileType} */
    #tileType;

    /** @type {TileMap} */
    #map;

    /** @type {TileCoordinates} */
    #coords;

    /**
     * A flag set true when changes to this tile will be recorded in the map animation
     * @type {Boolean}
     */
    #recordable;

    /** @type {String[]} */
    #properties;

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
        this.#recordable = false;
        
        this.addProperty('untouched'); // Mark all tiles as untouched when created
    }

    /**
     * Add a property to this Tile
     * @param {String} property 
     */
    addProperty(property) {
        if (this.#properties.indexOf(property) == -1) {
            this.#properties.push(property);
            if (this.#recordable) this.#map.animation.logTileUpdate(this);
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
            if (this.#recordable) this.#map.animation.logTileUpdate(this);
        }
    }
    
    /**
     * Make a deep copy of this tile
     * @returns {Tile}
     */
    copy() {
        let {x, y} = this.#coords;
        let tile = new Tile(this.#map, this.#tileType, x, y);
        this.#properties.forEach(prop => {
            tile.addProperty(JSON.parse(JSON.stringify(prop)));
        })

        tile.setRecordable(this.#recordable);
        return tile;
    }

    /**
     * Change the Tile's type
     * @param {TileType} tileType 
     */
    setType(tileType) {
        this.#tileType = tileType;
        this.removeProperty('untouched');

        if (this.#recordable) this.#map.animation.logTileUpdate(this);
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

    setRecordable(value) {
        this.#recordable = value;
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

export default Tile;