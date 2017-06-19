/**
 * Set a roving focus on a group of elements.
 * @author Evan Yamanishi
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex
 */

/**
 * Default configuration
 * @type {Object}
 */
const Default = {
    vertical: true,
    horizontal: true,
    wrap: true,
    initialFocusIndex: 0,
    resetOnExit: false,
};

/**
 * Private constants
 * @type {Symbol}
 */
const Backward = Symbol('backward');
const Forward = Symbol('forward');

/**
 * The main class
 * @type {Class}
 */
export default class Rover {
    /**
     * [constructor description]
     * @param  {Array} focusableElements An array of focusable elements.
     * @param  {Object} [config]         An optional configuration.
     */
    constructor(focusableElements, config) {
        this.elements = focusableElements;
        this.default = Default;
        this.config = Object.assign({}, Default, config);
        if (this.elements.length) this.init(true);
    }

    /**
     * Initialize the element
     * @param {Boolean} setListeners Option to set the event listeners.
     */
    init(setListeners) {
        this.elements.forEach((el, i) => {
            this.initTabindex(el, i);
            if (setListeners) this.setListeners(el, i);
        });
        return this;
    }

    /**
     * Initialize tabindex values on the element
     * @param  {Object} el The element.
     * @param  {Number} i  The element's index in the collection.
     */
    initTabindex(el, i) {
        if (i === this.config.initialFocusIndex) {
            if (el.getAttribute('href')) {
                el.removeAttribute('tabindex');
            } else {
                el.setAttribute('tabindex', 0);
            }
        } else {
            el.setAttribute('tabindex', -1);
        }
        return this;
    }

    setListeners(el, i) {
        el.addEventListener('keydown', (e) => {
            if (this.validKeys.includes(e.code)) {
                e.preventDefault();
                const nextIndex = this.nextIndex(i, this.forward.includes(e.code));
                Rover.moveFocus(el, this.elements[nextIndex]);
            }
        });
        el.addEventListener('blur', (e) => {
            const newFocus = e.relatedTarget;
            if (this.config.resetOnExit &&
                ![...this.elements].includes(newFocus)) {
                this.init(false);
            }
        });
        return this;
    }

    nextIndex(currentIndex, moveForward) {
        if (moveForward) {
            if (currentIndex === this.lastIndex) {
                if (this.config.wrap) return 0;
                return currentIndex;
            }
            return currentIndex + 1;
        }
        if (currentIndex === 0) {
            if (this.config.wrap) return this.lastIndex;
            return currentIndex;
        }
        return currentIndex - 1;
    }

    get backward() {
        if (!this[Backward]) {
            this[Backward] = [];
            if (this.config.vertical) this[Backward].push('ArrowUp');
            if (this.config.horizontal) this[Backward].push('ArrowLeft');
        }
        return this[Backward];
    }

    get forward() {
        if (!this[Forward]) {
            this[Forward] = [];
            if (this.config.vertical) this[Forward].push('ArrowDown');
            if (this.config.horizontal) this[Forward].push('ArrowRight');
        }
        return this[Forward];
    }

    get lastIndex() {
        return this.elements.length - 1;
    }

    get validKeys() {
        return this.backward.concat(this.forward) || [];
    }

    static moveFocus(from, to) {
        from.setAttribute('tabindex', -1);
        if (to.getAttribute('href')) {
            to.removeAttribute('tabindex');
        } else {
            to.setAttribute('tabindex', 0);
        }
        to.focus();
        return this;
    }
}
