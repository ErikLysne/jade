import { Component } from '../engine';

export class SpriteComponent extends Component {
	#width: number = 0;
	#height: number = 0;
	#source: string = '';

	setWidth(width: number): this {
		this.#width = width;
		return this;
	}

	setHeight(height: number): this {
		this.#height = height;
		return this;
	}

	setSource(source: string): this {
		this.#source = source;
		return this;
	}

	set(width: number, height: number, source: string): this {
		this.#width = width;
		this.#height = height;
		this.#source = source;
		return this;
	}

	getWidth(): number {
		return this.#width;
	}

	getHeight(): number {
		return this.#height;
	}

	getSource(): string {
		return this.#source;
	}

	get() {
		return {
			width: this.#width,
			height: this.#height,
			source: this.#source
		};
	}
}
