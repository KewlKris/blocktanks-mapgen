export default {
    'test': {
        name: 'Test',
        preset: {
            'setsymmetry': {
                'symmetryType': {
                    type: 'select',
                    value: 'radial'
                },
                'symmetryPoints': {
                    type: 'number',
                    value: 2
                }
            },
            'random': {
                'wallChance': {
                    type: 'number',
                    value: '0.3'
                }
            }
        }
    }
}