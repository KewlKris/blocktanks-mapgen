import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';
import CanvasManager from '../canvasmanager.js';
import Utils from './utils.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class DensityRandom extends Algorithm {
    static NAME = 'Density Random';
    static SETTINGS_TEMPLATE = {
        'tile1': {
            type: 'select',
            label: 'Tile 1',
            default: 'wall',
            options: [
                {label: 'Wall', value: 'wall'},
                {label: 'Fence', value: 'fence'},
                {label: 'Empty', value: 'empty'},
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
            ],
            randomValues: []
        },
        'targetDensity': {
            type: 'number',
            label: 'Target Density',
            default: 0.5,
            step: 0.1,
            min: 0,
            max: 10,
            randomMin: 0,
            randomMax: 10
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        while (true) {
            if (settings.tile1 == settings.tile2) throw new Error('Both tiles cannot be the same!');
            
            let emptyTiles = map.getTilesOfType(settings.tile2);
            let wallTiles = map.getTilesOfType(settings.tile1);

            if (emptyTiles.length == 0) return; // Map is solid!
            let density = wallTiles.length / emptyTiles.length;
            if (density >= settings.targetDensity) return; // Map is dense enough!

            // Pick random empty tile and fill it
            emptyTiles[Math.floor(rand() * emptyTiles.length)].symmetrySetType(settings.tile1);
        }
    }
}

export default DensityRandom;