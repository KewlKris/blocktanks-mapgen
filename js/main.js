import TileMap from './tilemap.js';
import CanvasManager from './canvasmanager.js';

async function init() {
    let canvasManager = new CanvasManager(document.getElementById('map-canvas'));
    await canvasManager.loadImages();
    let map = new TileMap(30, 20);
    map.animation.startRecording(map);

    for (let y=0; y<10; y++) {
        for (let x=0; x<10; x++) {
            map.getTile(x+5, y+5).setType(Math.random() < 0.5 ? 'fence' : 'wall');
        }
    }
    canvasManager.setMap(map);
    canvasManager.drawMap();
    canvasManager.updateMainCanvas

    map.animation.stopRecording();
    map.animation.playAnimation(canvasManager, 16, true);
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());