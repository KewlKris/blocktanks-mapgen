import Algorithm from './algorithm.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class Random extends Algorithm {
    static NAME = 'Random';
    static SETTINGS_TEMPLATE = {
        'wallChance': {
            type: 'number',
            label: 'Wall Chance',
            default: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
            randomMin: 0,
            randomMax: 1
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        let width = map.getWidth();
        let height = map.getHeight();

        for (let y=0; y<height; y++) {
            for (let x=0; x<width; x++) {
                let tile = map.getTile(x, y);
                tile.setType((rand() < settings.wallChance) ? 'wall' : 'empty');
            }
        }
    }
}

export default Random;