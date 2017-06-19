# focus-rover
Set a roving focus on a group of elements. See https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex for more info.

## Usage
* Node.js: install with `npm install focus-rover --save`.
* Browser: `<script src="focus-rover.min.js" />` ([focus-rover.min.js](https://github.com/sh0ji/focus-rover/blob/master/dist/focus-rover.min.js))

Initialize the focus-rover on any collection of elements.
```javascript
import Rover from 'focus-rover';

const myElements = document.querySelectorAll('li>a');
const rover = new Rover(myElements[, config]);
```
When the user focuses on any of the elements in the collection, they can then move through them with arrow keys. The next tab press will exit the group.

## Options

* `vertical` [Boolean] | default: `true`
Causes up and down arrow keys to move focus.

* `horizontal` [Boolean] | default: `true`
Causes left and right arrow keys to move focus.

* `wrap` [Boolean] | default: `true`
Set this to cause arrow keys to wrap around to the beginning or end.

* `initialFocusIndex` [Number] | default: `0`
Set the initially focusable element.

* `resetOnExit` [Boolean] | default: false
Set this to always
