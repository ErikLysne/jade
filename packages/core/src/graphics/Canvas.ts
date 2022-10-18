import { Vector2 } from '../math';

export interface CanvasOptions {
	width: number;
	height: number;
	canvasElement: HTMLCanvasElement;
	backgroundColor?: string;
	antiAliasingEnabled?: boolean;
}

export class Canvas {
	readonly #width: number;
	readonly #height: number;
	readonly #canvasElement: HTMLCanvasElement;
	readonly #antiAliasingEnabled?: boolean;
	readonly #ctx: CanvasRenderingContext2D;
	#backgroundColor: string;

	constructor(options: CanvasOptions) {
		this.#width = options.width;
		this.#height = options.height;
		this.#canvasElement = options.canvasElement;
		this.#backgroundColor = options.backgroundColor ?? '#28355d';
		this.#antiAliasingEnabled = options.antiAliasingEnabled;

		this.#ctx = this.#canvasElement.getContext('2d')!;
		this.#canvasElement.width = this.#width;
		this.#canvasElement.height = this.#height;
	}

	static createCanvasElement(ref: HTMLElement | null): HTMLCanvasElement {
		if (!ref) {
			throw new Error('Failed to create canvas: ref is not defined');
		}

		const canvasElement = document.createElement('canvas');
		canvasElement.style.width = '100%';
		canvasElement.style.height = '100%';
		ref.appendChild(canvasElement);

		return canvasElement;
	}

	getWidth(): number {
		return this.#width;
	}

	getHeight(): number {
		return this.#height;
	}

	getCanvasElement(): HTMLCanvasElement {
		return this.#canvasElement;
	}

	getCtx(): CanvasRenderingContext2D {
		return this.#ctx;
	}

	setBackgroundColor(color: string): Canvas {
		this.#backgroundColor = color;
		return this;
	}

	getBackgroundColor(): string {
		return this.#backgroundColor;
	}

	clear(): Canvas {
		this.#ctx.clearRect(0, 0, this.#width, this.#height);
		return this;
	}

	renderBackground(): Canvas {
		this.#ctx.save();
		this.#ctx.fillStyle = this.#backgroundColor;
		this.#ctx.fillRect(0, 0, this.#width, this.#height);
		this.#ctx.restore();
		return this;
	}

	worldPositionToCanvasPosition(position: Vector2): Vector2 {
		return new Vector2(0, this.#height).add(position.flipY());
	}

	canvasPositionToWorldPosition(position: Vector2): Vector2 {
		return new Vector2(0, this.#height).add(position.flipY());
	}
}
