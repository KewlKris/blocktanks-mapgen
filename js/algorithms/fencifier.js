import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';
import CanvasManager from '../canvasmanager.js';
import Utils from './utils.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class Fencifier extends Algorithm {
    static NAME = 'Fencifier';
    static SETTINGS_TEMPLATE = {
        'chance': {
            type: 'number',
            label: 'Chance',
            default: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
            randomMin: 0,
            randomMax: 0.5
        },
        'loneWalls': {
            type: 'checkbox',
            label: 'Lone Walls',
            default: true,
            randomFlip: true
        },
        'throughWalls': {
            type: 'checkbox',
            label: 'Through Walls',
            default: true,
            randomFlip: true
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        let wallTiles = map.getTilesOfType('wall');

        wallTiles.forEach(wallTile => {
            let possible = false;

            let tileLeft = wallTile.tileLeft?.getType();
            let tileRight = wallTile.tileRight?.getType();
            let tileAbove = wallTile.tileAbove?.getType();
            let tileBelow = wallTile.tileBelow?.getType();

            if (settings.loneWalls) {
                if (tileLeft == 'empty' && tileRight == 'empty' && tileAbove == 'empty' && tileBelow == 'empty') {
                    possible = true;
                }
            }
            if (settings.throughWalls) {
                if (tileLeft == 'empty' && tileRight == 'empty' && tileAbove == 'wall' && tileBelow == 'wall') {
                    possible = true;
                }
                if (tileLeft == 'wall' && tileRight == 'wall' && tileAbove == 'empty' && tileBelow == 'empty') {
                    possible = true;
                }
            }

            if (possible) {
                if (rand() < settings.chance) {
                    wallTile.symmetrySetType('fence');
                }
            }
        });
    }
}

export default Fencifier;