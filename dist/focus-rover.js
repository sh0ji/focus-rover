/**
 * Set a roving focus on a group of elements.
 * @author Evan Yamanishi
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex
 */

/**
 * Default configuration
 * @type {Object}
 */
var Default = {
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
var Backward = Symbol('backward');
var Forward = Symbol('forward');

/**
 * The main class
 * @type {Class}
 */
var Rover = function Rover(focusableElements, _config) {
    var elements = focusableElements || [];
    var config = _config;
    if (typeof focusableElements === 'object') {
        if (focusableElements instanceof NodeList) {
            elements = Array.from(focusableElements);
        } else {
            elements = [];
            config = focusableElements;
        }
    }
    this.elements = elements;
    this.default = Default;
    this.config = Object.assign({}, Default, config);
    if (this.elements.length) { this.init(true); }
};

var prototypeAccessors = { currentElement: {},backward: {},forward: {},lastIndex: {},validKeys: {} };

/**
 * Initialize the element
 * @param {Boolean} setListeners Option to set the event listeners.
 */
Rover.prototype.init = function init (setListeners) {
        var this$1 = this;

    this.elements.forEach(function (el, i) {
        this$1.initTabindex(el, i);
        if (setListeners) { this$1.setListeners(el, i); }
    });
    return this;
};

/**
 * Initialize tabindex values on the element
 * @param  {Object} el The element.
 * @param  {Number} i  The element's index in the collection.
 */
Rover.prototype.initTabindex = function initTabindex (el, i) {
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
};

Rover.prototype.setListeners = function setListeners (el, i) {
        var this$1 = this;

    var notEl = this.elements.filter(function (elem) { return elem !== el; });
    el.addEventListener('keydown', function (e) {
        if (this$1.validKeys.includes(e.code)) {
            e.preventDefault();
            var nextIndex = this$1.nextIndex(i, this$1.forward.includes(e.code));
            this$1.elements[nextIndex].focus();
        }
    });
    el.addEventListener('focusin', function (e) {
        if (e.target !== this$1.currentElement) {
            Rover.activate(el);
            notEl.forEach(function (elem) { return Rover.deactivate(elem); });
        }
    });
    el.addEventListener('blur', function (e) {
        var newFocus = e.relatedTarget;
        if (this$1.config.resetOnExit &&
            !this$1.elements.includes(newFocus)) {
            this$1.init(false);
        }
    });
    return this;
};

Rover.prototype.nextIndex = function nextIndex (currentIndex, moveForward) {
    if (moveForward) {
        if (currentIndex === this.lastIndex) {
            if (this.config.wrap) { return 0; }
            return currentIndex;
        }
        return currentIndex + 1;
    }
    if (currentIndex === 0) {
        if (this.config.wrap) { return this.lastIndex; }
        return currentIndex;
    }
    return currentIndex - 1;
};

prototypeAccessors.currentElement.get = function () {
    return this.elements.find(function (el) { return el.getAttribute('tabindex') !== '-1'; });
};

prototypeAccessors.backward.get = function () {
    if (!this[Backward]) {
        this[Backward] = [];
        if (this.config.vertical) { this[Backward].push('ArrowUp'); }
        if (this.config.horizontal) { this[Backward].push('ArrowLeft'); }
    }
    return this[Backward];
};

prototypeAccessors.forward.get = function () {
    if (!this[Forward]) {
        this[Forward] = [];
        if (this.config.vertical) { this[Forward].push('ArrowDown'); }
        if (this.config.horizontal) { this[Forward].push('ArrowRight'); }
    }
    return this[Forward];
};

prototypeAccessors.lastIndex.get = function () {
    return this.elements.length - 1;
};

prototypeAccessors.validKeys.get = function () {
    return this.backward.concat(this.forward) || [];
};

Rover.activate = function activate (el) {
    if (el.getAttribute('href')) {
        el.removeAttribute('tabindex');
    } else {
        el.setAttribute('tabindex', 0);
    }
    return this;
};

Rover.deactivate = function deactivate (el) {
    el.setAttribute('tabindex', -1);
    return this;
};

Object.defineProperties( Rover.prototype, prototypeAccessors );

export default Rover;
