import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';
import CanvasManager from '../canvasmanager.js';
import Utils from './utils.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class BlobsAndNoodles extends Algorithm {
    static NAME = 'Blobs and Noodles';
    static SETTINGS_TEMPLATE = {
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
            let emptyTiles = map.getTilesOfType('empty');
            let wallTiles = map.getTilesOfType('wall');

            if (emptyTiles.length == 0) return; // Map is solid!
            let density = wallTiles.length / emptyTiles.length;
            if (density >= settings.targetDensity) return; // Map is dense enough!

            // Pick random empty tile and fill it
            emptyTiles[Math.floor(rand() * emptyTiles.length)].symmetrySetType('wall');
        }
    }
}

export default BlobsAndNoodles;