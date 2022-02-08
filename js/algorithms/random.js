import Algorithm from './algorithm.js';

class Random extends Algorithm {
    static NAME = 'Random';
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

    static async execute(map, settings) {

    }
}

export default Random;