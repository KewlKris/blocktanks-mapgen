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
        'num1': {
            type: 'number',
            label: 'Number 1',

            default: 3,
            min: 0,
            max: 10,
            step: 1,
            randomMin: 2,
            randomMax: 8,
        },
        'num2': {
            type: 'number',
            label: 'Number 2',

            default: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
            randomMin: 0.1,
            randomMax: 0.9
        },
        'check1': {
            type: 'checkbox',
            label: 'True/False',

            default: true,
            randomFlip: true
        },
        'select1': {
            type: 'select',
            label: 'Select',

            default: 'yes',
            options: [
                {label: 'Yes', value: 'yes'},
                {label: 'No', value: 'no'},
                {label: 'Maybe', value: 'maybe'}
            ],
            randomValues: ['yes', 'no']
        }
    };

    /**
     * Run the algorithm with the given settings
     * @param {TileMap} map
     * @param {Object} settings 
     * @param {Function} rand - The PRNG function to use
     */
    static async execute(map, settings, rand) {
        throw new Error('This algorithm needs to implement execute()!');
    }
}

export default Algorithm;