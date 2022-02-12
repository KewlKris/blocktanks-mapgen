import TileMap from './tilemap.js';
import CanvasManager from './canvasmanager.js';
import AlgorithmManager from './algorithmmanager.js';
import ConsoleManager from './consolemanager.js';
import PRNG from './prng.js';
import Presets from './presets.js';

/** @type {TileMap} */
let latestMap = undefined;

/** @type {Boolean} */
let generatingMap = false;

async function init() {
    // Initialize static classes
    CanvasManager.initialize(document.getElementById('map-canvas'));
    let canvasPromise = CanvasManager.loadImages();
    AlgorithmManager.initialize();
    AlgorithmManager.addAlgorithm('setsymmetry');
    AlgorithmManager.addAlgorithm('random');
    AlgorithmManager.updateAlgorithmList();
    ConsoleManager.initialize();

    let presetSelect = document.getElementById('preset-select');

    // Initialize UI
    randomizeSeed();
    document.getElementById('randomize-button').addEventListener('click', () => {
        randomizeSeed();
        if (document.getElementById('autogen-checkbox').checked) {
            generateMap();
        }
    });
    document.getElementById('seed-value').addEventListener('change', () => {
        if (document.getElementById('autogen-checkbox').checked) {
            generateMap();
        }
    });
    document.getElementById('algorithms-panel').addEventListener('click', () => {
        if (document.getElementById('autogen-checkbox').checked) {
            generateMap();
        }
    });
    document.getElementById('algorithms-list').addEventListener('click', () => {
        presetSelect.value = 'custom';
    });
    document.getElementById('generate-button').addEventListener('click', () => generateMap());
    document.getElementById('algorithm-select').addEventListener('change', event => {
        if (event.target.value != 'select') {
            AlgorithmManager.addAlgorithm(event.target.value);
            AlgorithmManager.updateAlgorithmList();
            presetSelect.value = 'custom';
        }
        event.target.value = 'select';
    });
    
    // Initialize presets
    Object.keys(Presets).forEach(presetName => {
        let preset = Presets[presetName];
        let option = document.createElement('option');
        option.value = presetName;
        option.innerText = preset.name;
        presetSelect.appendChild(option);
    });
    let customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.innerText = 'Custom';
    presetSelect.appendChild(customOption);
    presetSelect.addEventListener('change', () => {
        if (presetSelect.value == 'custom') return;

        // Apply this preset
        AlgorithmManager.applyPreset(Presets[presetSelect.value].preset);
    });

    // Await promises
    await canvasPromise;

    // Pick a random preset
    let presetIndex = Math.floor(Math.random() * Object.keys(Presets).length);
    AlgorithmManager.applyPreset(Presets[Object.keys(Presets)[presetIndex]].preset);

    // Set random width and height
    let width = Math.floor(Math.random() * 20) + 15;
    let height = Math.floor(Math.random() * 20) + 15;
    document.getElementById('width-number').value = width;
    document.getElementById('height-number').value = height;

    // Start first map generation
    generateMap();
}

/**
 * Generate a new BlockTanks map
 */
async function generateMap() {
    if (generatingMap) return;
    if (latestMap?.animation.isPlaying()) latestMap.animation.stopAnimation();

    generatingMap = true;
    ConsoleManager.clear();
    ConsoleManager.log('Starting map generation!', 'green');
    let width = Number(document.getElementById('width-number').value);
    let height = Number(document.getElementById('height-number').value);
    ConsoleManager.log(`Width: ${width} Height: ${height}`, 'green');

    let map = new TileMap(width, height);
    CanvasManager.setMap(map);
    CanvasManager.drawMap();
    CanvasManager.updateMainCanvas();

    let seedText = String(document.getElementById('seed-value').value);
    ConsoleManager.log(`Using seed: ${seedText}`, 'green');
    let seedNumber = PRNG.hash(seedText);
    let rand = PRNG.prng(seedNumber);

    map.animation.startRecording(map);
    await AlgorithmManager.executeAlgorithms(map, rand, !document.getElementById('autogen-checkbox').checked);
    map.animation.stopRecording();

    CanvasManager.drawMap();
    CanvasManager.updateMainCanvas();

    document.getElementById('playanimation-button').onclick = () => {
        let delay = Number(document.getElementById('delay-number').value);
        map.animation.playAnimation(1000 / delay, document.getElementById('showcomputation-checkbox').checked);
    };

    generateJSCode(map);

    ConsoleManager.log('Finished map generation!', 'green');

    latestMap = map;
    generatingMap = false;
}

function randomizeSeed() {
    document.getElementById('seed-value').value = PRNG.seedFromRand(Math.random);
}

/**
 * Generate the BlockTanks.io loading code for a given map
 * @param {TileMap} tilemap 
 */
function generateJSCode(tilemap) {
    let log = ConsoleManager.log('Generating JS Code', 'yellow');

    let mapName = 'Generated Map';
    let width = tilemap.getWidth();
    let height = tilemap.getHeight();

    let blue_flag_spawns = [];
    let blue_spawns = [];
    let control_points = [];
    let ffa_spawns = [];
    let map = [];
    let power_up_spawns = [];
    let red_flag_spawns = [];
    let red_spawns = [];
    let roof_spawns = [];

    let propertyMap = {
        'roof': roof_spawns,
        'ffa_spawn': ffa_spawns,
        'weapon_spawn': power_up_spawns
    };
    
    for (let y=0; y<height; y++) {
        let row = [];
        for (let x=0; x<width; x++) {
            let tile = tilemap.getTile(x, y);
            let mapCoords = [
                (x * 100) + 50,
                (y + 100) + 50
            ];

            let id;
            switch (tile.getType()) {
                case 'empty':
                    id = 0;
                    break;
                case 'wall':
                    id = 1;
                    break;
                case 'fence':
                    id = 2;
                    break;
            }

            row.push(id);

            // Add properties
            Object.keys(propertyMap).forEach(key => {
                if (tile.hasProperty(key)) {
                    propertyMap[key].push(mapCoords);
                }
            });
        }
        map.push(row);
    }

    let data = {
        blue_flag_spawns, blue_spawns, control_points, ffa_spawns, map,
        power_up_spawns, red_flag_spawns, red_spawns, roof_spawns
    };

    let code = `fetch('/map',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:${JSON.stringify(mapName)},data:${JSON.stringify(data)}})}).then(r=>r.text()).then(t=>console.log(t));`;

    document.getElementById('jscode').innerText = code;

    log.setColor('green');
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());