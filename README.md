# focus-rover

Set a roving focus on a collection of elements.
Useful for composite widgets and promoting better keyboard user experiences.

See https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex for more info about roving tabindex.

## Usage

To get started, install the package through NPM and include it in your project.
It is a UMD package, so it will work in both Node and the browser.

```sh
npm install focus-rover
```

```javascript
// (Node.js)
const FocusRover = require('focus-rover');

const rover = new FocusRover();
rover.addElement(document.getElementById('my-first-element'));
rover.addElement(document.getElementById('my-second-element'));
rover.addElement(document.getElementById('etc'));
```

To save you some time, three static methods are provided to get your roving started!

### API

Three static methods are provided to initialize your collection of rovable elements.

```javascript
// from a CSS selector
let rover = FocusRover.fromSelector('li>a');

// from an existing NodeList
rover = FocusRover.fromNodeList(document.querySelectorAll('li>a'));

// from a collection of elements
const anchor1 = document.getElementById('a1');
const anchor2 = document.getElementById('a2');
const anchor3 = document.getElementById('a3');
rover = FocusRover.fromElements(anchor1, anchor2, anchor3);

// let FocusRover figure out what you mean
rover = FocusRover.from('li>a');
rover = FocusRover.from(document.querySelectorAll('li>a'));
rover = FocusRover.from(anchor1, anchor2, anchor3);
```

When the user focuses on any of the elements in the collection, they can then move through them with arrow keys. The next tab press will exit the group.

## Configuration

All FocusRover instances will follow the static `FocusRover.config`, which can be modified with `FocusRover.configure(userConfig)`, where `userConfig` can override any of the options in [the default config](src/index.ts#L1-L22).
