export default {
    'test': {
        name: 'Test',
        preset: {
            'setsymmetry': {
                settings: {
                    'symmetryType': {
                        type: 'select',
                        value: 'radial'
                    },
                    'symmetryPoints': {
                        type: 'number',
                        value: 2
                    }
                },
                minimized: true
            },
            'random': {
                settings: {
                    'tile1': {
                        type: 'select',
                        value: 'wall'
                    },
                    'tile2': {
                        type: 'select',
                        value: 'empty'
                    },
                    'chance': {
                        type: 'number',
                        value: '0.3'
                    }
                },
                minimized: false
            }
        }
    }
}