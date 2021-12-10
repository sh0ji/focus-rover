export interface FocusRoverConfig {
	/**
	 * A list of event.key values that will move focus to the next element.
	 * @default ['ArrowDown', 'ArrowRight']
	 */
	nextKeys: KeyboardEvent['key'][];
	/**
	 * A list of event.key values that will move focus to the previous element.
	 * @default [ArrowUp', 'ArrowLeft']
	 */
	prevKeys: KeyboardEvent['key'][];
	/**
	 * Whether focus should wrap when it gets to the end or beginning.
	 * @default true
	 */
	wrap: boolean;
	/**
	 * Whether focus should reset to the first item in the collection after exiting it.
	 * @default false
	 */
	resetOnBlur: boolean;
}

export default class FocusRover {
	/** The collection of managed focusable elements. */
	public elements = new Set<HTMLElement>();
	#focusIndex = 0;
	#roving = false;

	/** The element in the collection that is currently focusable. */
	public get focusedElement(): HTMLElement {
		return Array.from(this.elements)[this.#focusIndex];
	}

	/** Add an element to the collection of focusable elements. */
	public addElement(el: HTMLElement): this {
		el.addEventListener('keydown', this.onKeydown);
		el.addEventListener('blur', this.onBlur);
		this.elements.add(el);
		const tabindex = (this.focusedElement === el) ? '0' : '-1';
		el.setAttribute('tabindex', tabindex);
		return this;
	}

	/**
	 * Move the roving focus to a specified index in the collection of focusable
	 * elements.
	 */
	public rove(index: number): this {
		if (
			// not already focused
			this.#focusIndex !== index
			// and inside of the range of eligible indices
			&& index >= 0
			&& index < this.elements.size
		) {
			// toggle the roving flag so blur doesn't reset tabindex
			this.#roving = true;
			// unfocus the currently-focused element
			this.focusedElement.setAttribute('tabindex', '-1');
			// focus the next element
			const el = Array.from(this.elements)[index];
			el.removeAttribute('tabindex');
			el.focus();
			this.#focusIndex = index;
			this.#roving = false;
		}
		return this;
	}

	/** Move the roving focus to the next focusable element in the collection. */
	public next(): this {
		let nextIndex = this.#focusIndex + 1;
		if (nextIndex === this.elements.size) {
			nextIndex = (FocusRover.config.wrap) ? 0 : this.#focusIndex;
		}
		return this.rove(nextIndex);
	}

	/** Move the roving focus to the previous focusable element in the collection. */
	public prev(): this {
		let prevIndex = this.#focusIndex - 1;
		if (prevIndex === -1) {
			prevIndex = (FocusRover.config.wrap) ? this.elements.size - 1 : this.#focusIndex;
		}
		return this.rove(prevIndex);
	}

	/** @alias prev */
	public previous(): this { return this.prev(); }

	private onKeydown = ({ key }: Partial<KeyboardEvent>): void => {
		if (key) {
			if (FocusRover.config.nextKeys.includes(key)) {
				this.next();
			} else if (FocusRover.config.prevKeys.includes(key)) {
				this.prev();
			}
		}
	};

	private onBlur = (): void => {
		if (!this.#roving && FocusRover.config.resetOnBlur) {
			Array.from(this.elements)[0].setAttribute('tabindex', '0');
			this.focusedElement.setAttribute('tabindex', '-1');
			this.#focusIndex = 0;
		}
	};

	private static userConfig: Partial<FocusRoverConfig> = {};

	/** Build a FocusRover from a collection of elements or a selector. */
	public static from(item: HTMLElement[] | NodeListOf<HTMLElement> | string): FocusRover {
		if (typeof item === 'string') {
			return FocusRover.fromSelector(item);
		}
		if (item instanceof NodeList) {
			return FocusRover.fromNodeList(item);
		}
		return FocusRover.fromElements(...item);
	}

	/** Build a FocusRover from a list of elements */
	public static fromElements(...elements: HTMLElement[]): FocusRover {
		const rover = new FocusRover();
		elements.forEach(rover.addElement.bind(rover));
		return rover;
	}

	/** Build a FocusRover from a CSS selector. */
	public static fromSelector(selector: string): FocusRover {
		const elements = document.querySelectorAll<HTMLElement>(selector);
		return FocusRover.fromElements(...Array.from(elements));
	}

	/** Build a FocusRover from a NodeList (querySelectorAll collection) */
	public static fromNodeList(nodeList: NodeListOf<HTMLElement>): FocusRover {
		return FocusRover.fromElements(...Array.from(nodeList));
	}

	/** Configure all FocusRover instances. */
	public static configure(config: Partial<FocusRoverConfig>): void {
		FocusRover.userConfig = config;
	}

	/** The FocusRover configuration. */
	public static get config(): FocusRoverConfig {
		return { ...FocusRover.defaultConfig, ...(FocusRover.userConfig || {}) };
	}

	/** The default FocusRover configuration. */
	public static defaultConfig: FocusRoverConfig = {
		nextKeys: ['ArrowDown', 'ArrowRight'],
		prevKeys: ['ArrowUp', 'ArrowLeft'],
		wrap: true,
		resetOnBlur: false,
	};
}
