import TileMap from './tilemap.js';

async function init() {
    
}

// Initialize now or when the page finishes loading
if (document.readyState == 'complete') init();
else window.addEventListener('load', () => init());