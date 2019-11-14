# focus-rover

Set a roving focus on a group of elements.
See https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex for more info.

## Usage

Initialize the focus-rover on any collection of elements.
Three static methods are available for this.

```javascript
// from a CSS selector
FocusRover.fromSelector('li>a');

// from an existing NodeList
FocusRover.fromNodeList(document.querySelectorAll('li>a'));

// from a collection of elements
const anchor1 = document.getElementById('a1');
const anchor2 = document.getElementById('a2');
const anchor3 = document.getElementById('a3');
FocusRover.fromElements(anchor1, anchor2, anchor3);

// let FocusRover figure out what you mean
FocusRover.from('li>a');
FocusRover.from(document.querySelectorAll('li>a'));
FocusRover.from(anchor1, anchor2, anchor3);
```

When the user focuses on any of the elements in the collection, they can then move through them with arrow keys. The next tab press will exit the group.

## Configuration

All FocusRover instances will follow the static `FocusRover.config`, which can be modified with `FocusRover.configure(userConfig)`, where `userConfig` can override any of the options in the default config.
