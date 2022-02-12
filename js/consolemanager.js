/**
 * @typedef {'green' | 'yellow' | 'red'} ConsoleColor
 */

class ConsoleManager {
    /** @type {HTMLDivElement} */
    static #console;

    static initialize() {
        this.#console = document.getElementById('console');
    }

    /**
     * Add a new entry to the console
     * @param {String} text 
     * @param {ConsoleColor} [color]
     * @returns {ConsoleEntry}
     */
    static log(text, color='yellow') {
        let entry = new ConsoleEntry();
        entry.setText(text);
        entry.setColor(color);

        this.#console.appendChild(entry.getElement());

        return entry;
    }

    static clear() {
        Array(...this.#console.children).forEach(child => child.remove());
    }
}

class ConsoleEntry {
    /** @type {HTMLDivElement} */
    #element;

    /**
     * Initialize a new ConsoleEntry
     */
    constructor() {
        this.#element = document.createElement('div');
    }

    /**
     * Change the color of this entry
     * @param {ConsoleColor} color 
     */
    setColor(color) {
        this.#element.className = '';
        this.#element.classList.add(`console-${color}`);
    }

    /**
     * Change the text of this entry
     * @param {String} text 
     */
    setText(text) {
        this.#element.innerText = text;
    }

    getElement() {
        return this.#element;
    }
}

export default ConsoleManager;