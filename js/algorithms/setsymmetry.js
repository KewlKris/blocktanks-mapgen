import Algorithm from './algorithm.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class SetSymmetry extends Algorithm {
    static NAME = 'Set Symmetry';
    static SETTINGS_TEMPLATE = {
        'symmetryType': {
            type: 'select',
            label: 'Symmetry Type',

            default: 'none',
            options: [
                {label: 'None', value: 'none'},
                {label: 'X', value: 'x'},
                {label: 'Y', value: 'y'},
                {label: 'XY', value: 'xy'},
                {label: 'Radial', value: 'radial'},
            ],
            randomValues: ['none', 'x', 'y', 'xy']
        },
        'symmetryPoints': {
            type: 'number',
            label: 'Radial Points',
            default: 3,
            min: 2,
            max: 10,
            step: 1
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        map.setSymmetry(settings.symmetryType, settings.symmetryPoints);
    }
}

export default SetSymmetry;