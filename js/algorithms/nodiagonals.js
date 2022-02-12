import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';
import CanvasManager from '../canvasmanager.js';
import Utils from './utils.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class NoDiagonals extends Algorithm {
    static NAME = 'No Diagonals';
    static SETTINGS_TEMPLATE = {
        'tile': {
            type: 'select',
            label: 'Tile',
            default: 'wall',
            options: [
                {label: 'Wall', value: 'wall'},
                {label: 'Fence', value: 'fence'},
            ],
            randomValues: []
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        let changed;
        do {
            changed = false;
            let tiles = map.getTilesOfType(settings.tile);
            tiles = Utils.shuffle(rand, tiles); // Randomize
    
            tiles.forEach(tile => {
                let diagonal = false;
                if (tile.tileTopLeft?.getType() == settings.tile) {
                    if (tile.tileLeft.getType() == 'empty' && tile.tileAbove.getType() == 'empty') diagonal = true;
                }
                if (tile.tileTopRight?.getType() == settings.tile) {
                    if (tile.tileRight.getType() == 'empty' && tile.tileAbove.getType() == 'empty') diagonal = true;
                }
                if (tile.tileBottomLeft?.getType() == settings.tile) {
                    if (tile.tileLeft.getType() == 'empty' && tile.tileBelow.getType() == 'empty') diagonal = true;
                }
                if (tile.tileBottomRight?.getType() == settings.tile) {
                    if (tile.tileRight.getType() == 'empty' && tile.tileBelow.getType() == 'empty') diagonal = true;
                }
    
                if (diagonal) {
                    tile.symmetrySetType('empty');
                    changed = true;
                }
            });
        } while (changed);
    }
}

export default NoDiagonals;