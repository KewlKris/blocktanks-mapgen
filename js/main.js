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
    document.getElementById('randomize-button').addEventListener('click', () => randomizeSeed());
}

function randomizeSeed() {
    document.getElementById('seed-value').value = PRNG.seedFromRand(Math.random);
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());