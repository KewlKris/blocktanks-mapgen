import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class SetBlend extends Algorithm {
    static NAME = 'Set Symmetry';
    static SETTINGS_TEMPLATE = {
        'blendMode': {
            type: 'select',
            label: 'Blend Mode',

            default: 'overwrite',
            options: [
                {label: 'Overwrite', value: 'overwrite'},
                {label: 'Overlay', value: 'overlay'},
                {label: 'Clear', value: 'clear'},
            ],
            randomValues: ['overwrite', 'overlay', 'clear']
        },
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        ConsoleManager.log(`Setting blend mode to: ${settings.blendMode}`, 'green');
        map.setBlendMode(settings.blendMode);
    }
}

export default SetBlend;