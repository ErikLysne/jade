import { Canvas } from '../graphics';
import { Vector2 } from '../math';
import { Shape, ShapeRenderOptions } from './Shape';

export class Line extends Shape {
	private readonly startPosition: Vector2;
	private readonly endPosition: Vector2;

	constructor(options: {
		startPosition: Vector2;
		endPosition: Vector2;
		renderOptions?: ShapeRenderOptions;
	}) {
		const { startPosition, endPosition, renderOptions } = options;
		super(renderOptions || {});
		this.startPosition = startPosition;
		this.endPosition = endPosition;
	}

	isWithin(position: Vector2): boolean {
		return false;
	}

	render(canvas: Canvas, position: Vector2): void {
		const start = canvas.worldPositionToCanvasPosition(this.startPosition);
		const end = canvas.worldPositionToCanvasPosition(this.endPosition);

		const ctx = canvas.getCtx();
		ctx.save();
		this.applyStyles(ctx);
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}
