import Algorithm from './algorithms/algorithm.js';
import Random from './algorithms/random.js';

/**
 * @typedef {import('./tilemap.js').default} TileMap
 */

const ALGORITHMS = {
    'random': Random
}

class AlgorithmManager {
    /** @type {AlgorithmEntry[]} */
    static #algorithmEntries;

    static initialize() {
        this.#algorithmEntries = [];
    }

    static addAlgorithm(name) {
        let entry = new AlgorithmEntry(name);
        this.#algorithmEntries.push(entry);
    }

    /**
     * Remove an algorithm entry from the algorithm list
     * @param {AlgorithmEntry} entry 
     */
    static removeAlgorithmEntry(entry) {
        let index = this.#algorithmEntries.indexOf(entry);
        this.#algorithmEntries.splice(index, 1);

        this.updateAlgorithmList();
    }

    /**
     * Move an algorithm entry up on the algorithm list
     * @param {AlgorithmEntry} entry 
     */
    static moveAlgorithmEntryUp(entry) {
        let index = this.#algorithmEntries.indexOf(entry);
        if (index == 0) return; // We're already at the top

        this.#algorithmEntries.splice(index-1, 2, entry, this.#algorithmEntries[index-1]);
        this.updateAlgorithmList();
    }

    /**
     * Move an algorithm entry down on the algorithm list
     * @param {AlgorithmEntry} entry 
     */
    static moveAlgorithmEntryDown(entry) {
        let index = this.#algorithmEntries.indexOf(entry);
        if (index == this.#algorithmEntries.length-1) return; // We're already at the bottom

        this.#algorithmEntries.splice(index, 2, this.#algorithmEntries[index+1], entry);
        this.updateAlgorithmList();
    }

    static updateAlgorithmList() {
        let list = document.getElementById('algorithms-list');
        Array(...list.children).forEach(child => child.remove()); // Remove current elements

        this.#algorithmEntries.forEach(entry => {
            list.appendChild(entry.getElement());
        });
    }

    /**
     * Execute each algorithm in sequential order on the given TileMap
     * @param {TileMap} map 
     */
    static async executeAlgorithms(map) {
        for (let x=0; x<this.#algorithmEntries.length; x++) {
            let entry = this.#algorithmEntries[x];
            await entry.execute(map);
        }
    }
}

class AlgorithmEntry {
    /** @type {String} */
    #name;

    /**
     * The uninstantialized class of this algorithm
     * @type {Algorithm}
     */
    #algorithm;

    /** @type {HTMLDivElement} */
    #element;

    /**
     * @type {Object.<String, HTMLElement>}
     */
    #settingsElements;

    /** @type {Boolean} */
    #isMinimized;

    constructor(name) {
        this.#name = name;
        this.#algorithm = ALGORITHMS[name];

        this.#buildHTML();
        this.setMinimized(false);
    }

    resetSettings() {
        let template = this.#algorithm.SETTINGS_TEMPLATE;
        Object.keys(template).forEach(varName => {
            let setting = template[varName];
            let input = this.#settingsElements[varName];

            switch (setting.type) {
                case 'number':
                    input.value = setting.default;
                    break;
                case 'checkbox':
                    input.checked = setting.default;
                    break;
                case 'select':
                    input.value = setting.default;
                    break;
            }
        });
    }

    randomizeSettings() {
        let template = this.#algorithm.SETTINGS_TEMPLATE;
        Object.keys(template).forEach(varName => {
            let setting = template[varName];
            let input = this.#settingsElements[varName];

            switch (setting.type) {
                case 'number':
                    let intervalCount = ((setting.randomMax - setting.randomMin) / setting.step) + 1;
                    let interval = Math.floor(Math.random() * intervalCount);
                    input.value = setting.randomMin + (interval * setting.step);
                    break;
                case 'checkbox':
                    if (setting.randomFlip) {
                        input.checked = (Math.random() < 0.5);
                    } else {
                        input.checked = setting.default;
                    }
                    break;
                case 'select':
                    input.value = setting.randomValues[Math.floor(Math.random() * setting.randomValues.length)];
                    break;
            }
        });
    }

    getSettingsValues() {
        let settings = {};

        let template = this.#algorithm.SETTINGS_TEMPLATE;
        Object.keys(template).forEach(varName => {
            let setting = template[varName];
            let input = this.#settingsElements[varName];

            let value;
            switch (setting.type) {
                case 'number':
                    value = Number(input.value);
                    break;
                case 'checkbox':
                    value = Boolean(input.checked);
                    break;
                case 'select':
                    value = String(input.value);
                    break;
            }
            settings[varName] = value;
        });

        return settings;
    }

    /**
     * Execute this entry's algorithm
     * @param {TileMap} map 
     */
    async execute(map) {
        let settings = this.getSettingsValues();
        await this.#algorithm.execute(map, settings);
    }

    getElement() {
        return this.#element;
    }

    setMinimized(value) {
        this.#isMinimized = value;

        let settingsDiv = this.#element.querySelectorAll('div')[1];
        settingsDiv.style.display = value ? 'none' : '';
    }

    #buildHTML() {
        let create = el => document.createElement(el);

        let mainDiv = create('div');
        mainDiv.classList.add('algorithm');

        let headerDiv = create('div');
        let nameSpan = create('span');
        nameSpan.innerText = this.#algorithm.NAME;
        nameSpan.addEventListener('click', () => this.setMinimized(!this.#isMinimized));
        let resetSpan = create('span');
        resetSpan.innerText = '↻';
        resetSpan.addEventListener('click', () => this.resetSettings());
        let randomSpan = create('span');
        randomSpan.innerText = '🎲';
        randomSpan.addEventListener('click', () => this.randomizeSettings());
        let moveUpSpan = create('span');
        moveUpSpan.innerText = '▲';
        moveUpSpan.addEventListener('click', () => AlgorithmManager.moveAlgorithmEntryUp(this));
        let moveDownSpan = create('span');
        moveDownSpan.innerText = '▼';
        moveDownSpan.addEventListener('click', () => AlgorithmManager.moveAlgorithmEntryDown(this));
        let removeSpan = create('span');
        removeSpan.innerText = 'X';
        removeSpan.addEventListener('click', () => AlgorithmManager.removeAlgorithmEntry(this));
        [nameSpan, resetSpan, randomSpan, moveUpSpan, moveDownSpan, removeSpan].forEach(el => headerDiv.appendChild(el));

        // Add settings
        let settingsDiv = create('div');
        let settingsTable = create('table');
        settingsTable.classList.add('settings-table');

        let template = this.#algorithm.SETTINGS_TEMPLATE;
        this.#settingsElements = {};
        Object.keys(template).forEach(varName => {
            let setting = template[varName];

            let tr = create('tr');
            let label = create('td');
            label.innerText = `${setting.label}:`;
            let td = create('td');
            let input;
            switch (setting.type) {
                case 'number':
                    input = create('input');
                    input.type = 'number';
                    input.value = setting.default;
                    input.min = setting.min;
                    input.max = setting.max;
                    input.step = setting.step;
                    break;
                case 'checkbox':
                    input = create('input');
                    input.type = 'checkbox';
                    input.checked = setting.default;
                    break;
                case 'select':
                    input = create('select');
                    input.value = setting.default;
                    setting.options.forEach(option => {
                        let el = create('option');
                        el.innerText = option.label;
                        el.value = option.value;
                        input.appendChild(el);
                    });
                    break;
            }
            this.#settingsElements[varName] = input;
            td.appendChild(input);

            [label, td].forEach(el => tr.appendChild(el));
            settingsTable.appendChild(tr);
        });

        settingsDiv.appendChild(settingsTable);

        [headerDiv, settingsDiv].forEach(el => mainDiv.appendChild(el));
        this.#element = mainDiv;
    }
}

export default AlgorithmManager;