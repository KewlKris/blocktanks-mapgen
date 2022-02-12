export default {
    'test': {
        name: 'Test',
        preset: {
            'setsymmetry': {
                settings: {
                    'symmetryType': 'radial',
                    'symmetryPoints': 2
                },
                minimized: true
            },
            'random': {
                settings: {
                    'tile1': 'wall',
                    'tile2': 'empty',
                    'chance': 0.3
                },
                minimized: false
            },
            'holepuncher': {
                settings: {
                    'punchRate': 0.2
                },
                minimized: false
            },
            'nodiagonals': {
                settings: {
                    'tile': 'wall'
                },
                minimized: false
            }
        }
    }
}