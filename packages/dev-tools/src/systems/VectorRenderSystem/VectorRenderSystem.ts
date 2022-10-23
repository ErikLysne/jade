import { Canvas, RenderSystem, ShapeOptions, Vector2 } from '@jade/core';
import { Arrow } from './Arrow';

export abstract class VectorRenderSystem extends RenderSystem {
	protected arrowLength = 30;
	protected arrowOptions: ShapeOptions = {};
	protected renderPriority = 0;

	setArrowLength(length: number): this {
		this.arrowLength = length;
		return this;
	}

	getArrowLength(): number {
		return this.arrowLength;
	}

	setArrowOptions(options: ShapeOptions): this {
		this.arrowOptions = options;
		return this;
	}

	getArrowOptions(): ShapeOptions {
		return this.arrowOptions;
	}

	protected renderVector(
		canvas: Canvas,
		position: Vector2,
		vector: Vector2,
		text?: string
	): void {
		new Arrow({
			direction: vector,
			length: this.arrowLength,
			text: text,
			...this.arrowOptions
		}).render(canvas, position);
	}
}
