var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

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
    resetOnExit: false
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

var Rover = function () {
    /**
     * [constructor description]
     * @param  {Array} focusableElements An array of focusable elements.
     * @param  {Object} [config]         An optional configuration.
     */
    function Rover(focusableElements, config) {
        classCallCheck(this, Rover);

        this.elements = focusableElements;
        this.default = Default;
        this.config = Object.assign({}, Default, config);
        if (this.elements.length) this.init(true);
    }

    /**
     * Initialize the element
     * @param {Boolean} setListeners Option to set the event listeners.
     */


    createClass(Rover, [{
        key: 'init',
        value: function init(setListeners) {
            var _this = this;

            this.elements.forEach(function (el, i) {
                _this.initTabindex(el, i);
                if (setListeners) _this.setListeners(el, i);
            });
            return this;
        }

        /**
         * Initialize tabindex values on the element
         * @param  {Object} el The element.
         * @param  {Number} i  The element's index in the collection.
         */

    }, {
        key: 'initTabindex',
        value: function initTabindex(el, i) {
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
    }, {
        key: 'setListeners',
        value: function setListeners(el, i) {
            var _this2 = this;

            el.addEventListener('keydown', function (e) {
                if (_this2.validKeys.includes(e.code)) {
                    e.preventDefault();
                    var nextIndex = _this2.nextIndex(i, _this2.forward.includes(e.code));
                    Rover.moveFocus(el, _this2.elements[nextIndex]);
                }
            });
            el.addEventListener('blur', function (e) {
                var newFocus = e.relatedTarget;
                if (_this2.config.resetOnExit && ![].concat(toConsumableArray(_this2.elements)).includes(newFocus)) {
                    _this2.init(false);
                }
            });
            return this;
        }
    }, {
        key: 'nextIndex',
        value: function nextIndex(currentIndex, moveForward) {
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
    }, {
        key: 'backward',
        get: function get$$1() {
            if (!this[Backward]) {
                this[Backward] = [];
                if (this.config.vertical) this[Backward].push('ArrowUp');
                if (this.config.horizontal) this[Backward].push('ArrowLeft');
            }
            return this[Backward];
        }
    }, {
        key: 'forward',
        get: function get$$1() {
            if (!this[Forward]) {
                this[Forward] = [];
                if (this.config.vertical) this[Forward].push('ArrowDown');
                if (this.config.horizontal) this[Forward].push('ArrowRight');
            }
            return this[Forward];
        }
    }, {
        key: 'lastIndex',
        get: function get$$1() {
            return this.elements.length - 1;
        }
    }, {
        key: 'validKeys',
        get: function get$$1() {
            return this.backward.concat(this.forward) || [];
        }
    }], [{
        key: 'moveFocus',
        value: function moveFocus(from, to) {
            from.setAttribute('tabindex', -1);
            if (to.getAttribute('href')) {
                to.removeAttribute('tabindex');
            } else {
                to.setAttribute('tabindex', 0);
            }
            to.focus();
            return this;
        }
    }]);
    return Rover;
}();

export default Rover;
