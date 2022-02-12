export default {
    'generic': {
        name: 'Generic',
        preset: {
            'setsymmetry': {
                settings: {
                    'symmetryType': 'radial',
                    'symmetryPoints': 2
                },
                minimized: false
            },
            'densityrandom': {
                settings: {
                    'tile1': 'wall',
                    'tile2': 'empty',
                    'targetDensity': 2
                },
                minimized: false
            },
            'holepuncher': {
                settings: {
                    'punchRate': 0.2
                },
                minimized: true
            },
            'nodiagonals': {
                settings: {
                    'tile': 'wall'
                },
                minimized: true
            }
        }
    }
}