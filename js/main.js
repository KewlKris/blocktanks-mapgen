import TileMap from './tilemap.js';
import CanvasManager from './canvasmanager.js';
import AlgorithmManager from './algorithmmanager.js';
import PRNG from './prng.js';

async function init() {
    // Initialize static classes
    CanvasManager.initialize(document.getElementById('map-canvas'));
    let canvasPromise = CanvasManager.loadImages();
    AlgorithmManager.initialize();
    AlgorithmManager.addAlgorithm('setsymmetry');
    AlgorithmManager.addAlgorithm('random');
    AlgorithmManager.updateAlgorithmList();

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
    document.getElementById('algorithms-panel').addEventListener('change', () => {
        if (document.getElementById('autogen-checkbox').checked) {
            generateMap();
        }
    });
    document.getElementById('generate-button').addEventListener('click', () => generateMap());
    document.getElementById('algorithm-select').addEventListener('change', event => {
        if (event.target.value != 'select') {
            AlgorithmManager.addAlgorithm(event.target.value);
            AlgorithmManager.updateAlgorithmList();
        }
        event.target.value = 'select';
    });

    // Await promises
    await canvasPromise;
}

/**
 * Generate a new BlockTanks map
 */
async function generateMap() {
    console.log('Starting map generation');
    let width = Number(document.getElementById('width-number').value);
    let height = Number(document.getElementById('height-number').value);

    let map = new TileMap(width, height);
    CanvasManager.setMap(map);
    CanvasManager.drawMap();
    CanvasManager.updateMainCanvas();

    let seedText = String(document.getElementById('seed-value').value);
    let seedNumber = PRNG.hash(seedText);
    let rand = PRNG.prng(seedNumber);

    map.animation.startRecording(map);
    await AlgorithmManager.executeAlgorithms(map, rand);
    map.animation.stopRecording();

    CanvasManager.drawMap();
    CanvasManager.updateMainCanvas();

    document.getElementById('playanimation-button').onclick = () => {
        let delay = Number(document.getElementById('delay-number').value);
        map.animation.playAnimation(delay, true);
    };
    console.log('Finished map generation')
}

function randomizeSeed() {
    document.getElementById('seed-value').value = PRNG.seedFromRand(Math.random);
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());