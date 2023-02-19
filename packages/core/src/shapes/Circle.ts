import { Canvas } from '../graphics';
import { Vector2 } from '../math';
import { Shape, ShapeRenderOptions } from './Shape';

export class Circle extends Shape {
	private readonly radius: number;

	constructor(options: {
		radius: number;
		renderOptions?: ShapeRenderOptions;
	}) {
		const { radius, renderOptions } = options;
		super(renderOptions || {});
		this.radius = radius;
	}

	isWithin(position: Vector2): boolean {
		return position.magnitude() <= this.radius;
	}

	render(canvas: Canvas, position: Vector2): void {
		const ctx = canvas.getCtx();
		ctx.save();
		this.applyStyles(ctx);
		ctx.beginPath();
		ctx.arc(position.x, position.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}
