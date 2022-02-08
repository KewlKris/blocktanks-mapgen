import TileMap from './tilemap.js';
import CanvasManager from './canvasmanager.js';
import AlgorithmManager from './algorithmmanager.js';
import PRNG from './prng.js';

async function init() {
    let canvasManager = new CanvasManager(document.getElementById('map-canvas'));
    await canvasManager.loadImages();

    AlgorithmManager.initialize();
    AlgorithmManager.addAlgorithm('random');
    AlgorithmManager.updateAlgorithmList();

    // Initialize UI
    randomizeSeed();
    document.getElementById('randomize-button').addEventListener('click', () => {
        randomizeSeed();
        if (document.getElementById('autogen-checkbox').checked) {
            generateMap(canvasManager);
        }
    });
    document.getElementById('seed-value').addEventListener('change', () => {
        if (document.getElementById('autogen-checkbox').checked) {
            generateMap(canvasManager);
        }
    });
    document.getElementById('generate-button').addEventListener('click', () => generateMap(canvasManager));
}

/**
 * Generate a new BlockTanks map
 * @param {CanvasManager} canvasManager 
 */
async function generateMap(canvasManager) {
    console.log('Starting map generation');
    let width = Number(document.getElementById('width-number').value);
    let height = Number(document.getElementById('height-number').value);

    let map = new TileMap(width, height);
    canvasManager.setMap(map);
    canvasManager.drawMap();
    canvasManager.updateMainCanvas();

    let seedText = String(document.getElementById('seed-value').value);
    let seedNumber = PRNG.hash(seedText);
    let rand = PRNG.prng(seedNumber);

    map.animation.startRecording(map);
    await AlgorithmManager.executeAlgorithms(map, canvasManager, rand);
    map.animation.stopRecording();

    canvasManager.drawMap();
    canvasManager.updateMainCanvas();

    document.getElementById('playanimation-button').onclick = () => {
        let delay = Number(document.getElementById('delay-number').value);
        map.animation.playAnimation(canvasManager, delay, true);
    };
    console.log('Finished map generation')
}

function randomizeSeed() {
    document.getElementById('seed-value').value = PRNG.seedFromRand(Math.random);
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());