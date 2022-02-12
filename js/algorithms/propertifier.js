import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';
import CanvasManager from '../canvasmanager.js';
import Utils from './utils.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class Propertifier extends Algorithm {
    static NAME = 'Propertifier';
    static SETTINGS_TEMPLATE = {
        'tile': {
            type: 'select',
            label: 'Tile',
            default: 'empty',
            options: [
                {label: 'Wall', value: 'wall'},
                {label: 'Fence', value: 'fence'},
                {label: 'Empty', value: 'empty'},
            ],
            randomValues: []
        },
        'cozyTile': {
            type: 'select',
            label: 'Cozy Tile',
            default: 'wall',
            options: [
                {label: 'Wall', value: 'wall'},
                {label: 'Fence', value: 'fence'},
                {label: 'Empty', value: 'empty'},
                {label: 'None', value: 'none'}
            ],
            randomValues: []
        },
        'property': {
            type: 'select',
            label: 'Property',
            default: 'roof',
            options: [
                {label: 'Roof', value: 'roof'},
                {label: 'Weapon Spawn', value: 'weapon_spawn'},
                {label: 'FFA Spawn', value: 'ffa_spawn'}
            ]
        },
        'cozyBias': {
            type: 'number',
            label: 'Cozy Bias',
            default: 0,
            min: 0,
            max: 1,
            step: 0.01,
            randomMin: 0,
            randomMax: 1
        },
        'diagonalCozy': {
            type: 'checkbox',
            label: 'Diagonal Cozy',
            default: true,
            randomFlip: true
        },
        'selfCozy': {
            type: 'checkbox',
            label: 'Self Cozy',
            default: true,
            randomFlip: true
        },
        'rate': {
            type: 'number',
            label: 'Rate',
            default: 5,
            min: 1,
            step: 1,
            randomMin: 1,
            randomMax: 15
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        let tiles = map.getTilesOfType(settings.tile);
        tiles = Utils.shuffle(rand, tiles);

        let isCozyTile = tile => {
            if (tile.getType() == settings.cozyTile) return true;
            if (settings.selfCozy && tile.hasProperty(settings.property)) return true;
            return false;
        }

        let possibleTiles = [];
        tiles.forEach(tile => {
            let cozyScore = 0;
            [tile.tileLeft, tile.tileRight, tile.tileAbove, tile.tileBelow].forEach(testTile => {
                if (isCozyTile(testTile)) cozyScore++;
            });

            if (settings.diagonalCozy) {
                [tile.tileTopLeft, tile.tileTopRight, tile.tileBottomLeft, tile.tileBottomRight].forEach(testTile => {
                    if (isCozyTile(testTile)) cozyScore++;
                });
            }

            possibleTiles.push({
                tile: tile,
                cozyScore: cozyScore
            });
        });

        possibleTiles.sort((a, b) => b.cozyScore - a.cozyScore); // Sort the coziest tiles to be first

        let addCount = Math.ceil(tiles.length / settings.rate);
        let bias = 1 - settings.cozyBias;
        for (let i=0; i<addCount; i++) {
            let selection = possibleTiles.slice(0, Math.ceil(possibleTiles.length * bias));
            let selectedTile = selection[Math.floor(selection.length * rand())];
            selectedTile.tile.symmetryAddProperty(settings.property);
        }
    }
}

export default Propertifier;