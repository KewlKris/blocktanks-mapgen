import {TileMap} from './tilemap.js';
import CanvasManager from './canvasmanager.js';

async function init() {
    let canvasManager = new CanvasManager(document.getElementById('map-canvas'));
    let map = new TileMap(20, 40);
    canvasManager.setMap(map);
    canvasManager.drawMap();
    canvasManager.updateMainCanvas();
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());