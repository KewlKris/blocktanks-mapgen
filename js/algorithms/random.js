import Algorithm from './algorithm.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class Random extends Algorithm {
    static NAME = 'Random';
    static SETTINGS_TEMPLATE = {
        'tile1': {
            type: 'select',
            label: 'Tile 1',
            default: 'wall',
            options: [
                {label: 'Wall', value: 'wall'},
                {label: 'Fence', value: 'fence'},
                {label: 'Empty', value: 'empty'},
                {label: 'None', value: 'none'}
            ],
            randomValues: []
        },
        'tile2': {
            type: 'select',
            label: 'Tile 2',
            default: 'empty',
            options: [
                {label: 'Wall', value: 'wall'},
                {label: 'Fence', value: 'fence'},
                {label: 'Empty', value: 'empty'},
                {label: 'None', value: 'none'}
            ],
            randomValues: []
        },
        'chance': {
            type: 'number',
            label: 'Chance',
            default: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
            randomMin: 0,
            randomMax: 1
        },
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
                if (rand() < settings.chance) {
                    if (settings.tile1 != 'none') {
                        tile.symmetrySetType(settings.tile1);
                    }
                } else {
                    if (settings.tile2 != 'none') {
                        tile.symmetrySetType(settings.tile2);
                    }
                }
            }
        }
    }
}

export default Random;