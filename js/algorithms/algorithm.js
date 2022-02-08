/**
 * @typedef {import('../tilemap.js').default} TileMap
 * @typedef {import('../tile.js').default} Tile
 */


/**
 * This is an Abstract class and is not intended to be used directly
 */
class Algorithm {
    static NAME = 'Algorithm';
    static SETTINGS_TEMPLATE = {
        'test': {
            type: 'number',
            label: 'Test'
        }
    };

    /**
     * Run the algorithm with the given settings
     * @param {TileMap} map
     * @param {Object} settings 
     */
    static async execute(map, settings) {
        throw new Error('This algorithm needs to implement execute()!');
    }
}

export default Algorithm;