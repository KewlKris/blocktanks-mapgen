export default {
    'generic': {
        name: 'Generic',
        preset: [
            {
                algorithm: 'setsymmetry',
                settings: {
                    'symmetryType': 'radial',
                    'symmetryPoints': 2
                },
                minimized: false
            },
            {
                algorithm: 'densityrandom',
                settings: {
                    'tile1': 'wall',
                    'tile2': 'empty',
                    'targetDensity': 2
                },
                minimized: false
            },
            {
                algorithm: 'holepuncher',
                settings: {
                    'punchRate': 0.2
                },
                minimized: true
            },
            {
                algorithm: 'nodiagonals',
                settings: {
                    'tile': 'wall'
                },
                minimized: true
            },
            {
                algorithm: 'fencifier',
                settings: {
                    'chance': 0.2,
                    'loneWalls': true,
                    'throughWalls': true
                }
            },
            {
                algorithm: 'propertifier',
                settings: {
                    'tile': 'empty',
                    'cozyTile': 'wall',
                    'property': 'roof',
                    'cozyBias': 0.95,
                    'diagonalCozy': true,
                    'selfCozy': true,
                    'rate': 60
                },
                minimized: false
            },
            {
                algorithm: 'propertifier',
                settings: {
                    'tile': 'empty',
                    'cozyTile': 'wall',
                    'property': 'weapon_spawn',
                    'cozyBias': 0.5,
                    'diagonalCozy': false,
                    'selfCozy': false,
                    'rate': 40
                },
                minimized: false
            },
            {
                algorithm: 'propertifier',
                settings: {
                    'tile': 'empty',
                    'cozyTile': 'none',
                    'property': 'ffa_spawn',
                    'cozyBias': 0,
                    'diagonalCozy': false,
                    'selfCozy': false,
                    'rate': 160
                },
                minimized: false
            }
        ]
    }
}