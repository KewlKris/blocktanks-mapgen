/**
 * @typedef {import('../tilemap.js').default} TileMap
 * @typedef {import('../tile.js').default} Tile
 */

/**
 * Return a randomized version of the given array
 * @param {Function} rand 
 * @param {Object[]} array 
 * @returns {Object[]}
 */
function shuffle(rand, array) {
    let newArray = [];
    while (array.length > 0) {
        let index = Math.floor(rand() * array.length);
        newArray.push(array[index]);
        array.splice(index, 1);
    }

    return newArray;
}

/**
 * Get the density of each empty tile in relation to each wall tile
 * @param {TileMap} map 
 * @returns {{tile: Tile, density: Number}[]} The empty tiles with their densities sorted least to greatest
 */
function getEmptyDensity(map) {
    let emptyTiles = map.getTilesOfType('empty');
    let wallTiles = map.getTilesOfType('wall');
    //wallTiles = wallTiles.filter(wallTile => !wallTile.hasProperty('immutable'));

    let wallCount = wallTiles.length;

    let densities = emptyTiles.map(emptyTile => {
        let total = 0;
        let emptyCoords = emptyTile.getCoords();

        wallTiles.forEach(wallTile => {
            let wallCoords = wallTile.getCoords();
            total += Math.sqrt(Math.pow(emptyCoords.x - wallCoords.x, 2) + Math.pow(emptyCoords.y - wallCoords.y, 2));
        });

        if (wallCount > 0) {
            total /= wallCount;
        } else {
            total = Infinity;
        }

        return {
            tile: emptyTile,
            density: total
        };
    });

    return densities.sort((a, b) => b.density - a.density); // Sort to bring the least dense tiles first
}

export default {
    shuffle,
    getEmptyDensity
}