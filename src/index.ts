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
	public elements = new Set<HTMLElement>();
	private focusIndex = 0;
	private roving = false;

	public addElement(el: HTMLElement): this {
		el.addEventListener('keydown', this.onKeydown);
		el.addEventListener('blur', this.onBlur);
		this.elements.add(el);
		const tabindex = (Array.from(this.elements)[this.focusIndex] === el) ? '0' : '-1';
		el.setAttribute('tabindex', tabindex);
		return this;
	}

	public focus(index: number): this {
		if (
			// already focused
			this.focusIndex !== index
			// outside of the range of eligible indices
			&& index >= 0
			&& index < this.elements.size
		) {
			// toggle the roving flag so blur doesn't reset
			this.roving = true;
			// unfocus the currently-focused element
			Array.from(this.elements)[this.focusIndex].setAttribute('tabindex', '-1');
			// focus the next element
			const el = Array.from(this.elements)[index];
			el.removeAttribute('tabindex');
			el.focus();
			this.focusIndex = index;
			this.roving = false;
		}
		return this;
	}

	public focusNext(): this {
		let nextIndex = this.focusIndex + 1;
		if (nextIndex === this.elements.size) {
			nextIndex = (FocusRover.config.wrap) ? 0 : this.focusIndex;
		}
		return this.focus(nextIndex);
	}

	public focusPrev(): this {
		let prevIndex = this.focusIndex - 1;
		if (prevIndex === -1) {
			prevIndex = (FocusRover.config.wrap) ? this.elements.size - 1 : this.focusIndex;
		}
		return this.focus(prevIndex);
	}

	private onKeydown = ({ key }: Partial<KeyboardEvent>): void => {
		if (key) {
			if (FocusRover.config.nextKeys.includes(key)) {
				this.focusNext();
			} else if (FocusRover.config.prevKeys.includes(key)) {
				this.focusPrev();
			}
		}
	}

	private onBlur = (): void => {
		if (!this.roving && FocusRover.config.resetOnBlur) {
			Array.from(this.elements)[0].removeAttribute('tabindex');
			Array.from(this.elements)[this.focusIndex].setAttribute('tabindex', '-1');
			this.focusIndex = 0;
		}
	}

	private static userConfig: Partial<FocusRoverConfig> = {};

	public static fromElements(...elements: HTMLElement[]): FocusRover {
		const rover = new FocusRover();
		elements.forEach(rover.addElement.bind(rover));
		return rover;
	}

	public static fromSelection(selector: string): FocusRover {
		const elements = document.querySelectorAll<HTMLElement>(selector);
		return FocusRover.fromElements(...Array.from(elements));
	}

	public static configure(config: Partial<FocusRoverConfig>): void {
		FocusRover.userConfig = config;
	}

	public static get config(): FocusRoverConfig {
		return { ...FocusRover.defaultConfig, ...(FocusRover.userConfig || {}) };
	}

	private static defaultConfig: FocusRoverConfig = {
		nextKeys: [
			'ArrowDown',
			'ArrowRight',
		],
		prevKeys: [
			'ArrowUp',
			'ArrowLeft',
		],
		wrap: true,
		resetOnBlur: false,
	}
}
