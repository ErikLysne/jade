import { Component } from '../engine';

export class ClickableComponent extends Component {
	private clickPriority = 0;
	private allowClickThrough = false;

	setClickPriority(priority: number): this {
		this.clickPriority = priority;
		return this;
	}

	getClickPriority(): number {
		return this.clickPriority;
	}

	setAllowClickThrough(allowClickThrough: boolean): this {
		this.allowClickThrough = allowClickThrough;
		return this;
	}

	getAllowClickThrough(): boolean {
		return this.allowClickThrough;
	}

	set(clickPriority: number, allowClickThrough: boolean = false) {
		this.clickPriority = clickPriority;
		this.allowClickThrough = allowClickThrough;
	}

	get(): { clickPriority: number; allowClickThrough: boolean } {
		return {
			clickPriority: this.clickPriority,
			allowClickThrough: this.allowClickThrough
		};
	}
}
