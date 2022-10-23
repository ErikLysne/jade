import { Canvas, Shape, Vector2 } from '@jade/core';
import { ShapeOptions } from '@jade/core/lib/systems/ShapeRenderSystem/Shape';

export class Arrow extends Shape {
	private readonly direction: Vector2;
	private readonly length: number;
	private readonly text?: string;

	constructor(
		options: {
			direction: Vector2;
			length: number;
			text?: string;
		} & ShapeOptions
	) {
		const { direction, length, text, ...rest } = options;
		super(rest);
		this.direction = direction;
		this.length = length;
		this.text = text;
	}

	render(canvas: Canvas, position: Vector2): void {
		const directionUnit = this.direction.normalize();

		const arrowBase = position;
		const arrowTip = position.add(directionUnit.scale(this.length));
		const arrowHead1 = arrowTip.add(
			directionUnit.rotate((-14 * Math.PI) / 16).scale(this.length / 4)
		);
		const arrowHead2 = arrowTip.add(
			directionUnit.rotate((14 * Math.PI) / 16).scale(this.length / 4)
		);

		const arrowBaseCanvas = canvas.worldPositionToCanvasPosition(arrowBase);
		const arrowTipCanvas = canvas.worldPositionToCanvasPosition(arrowTip);
		const arrowHead1Canvas =
			canvas.worldPositionToCanvasPosition(arrowHead1);
		const arrowHead2Canvas =
			canvas.worldPositionToCanvasPosition(arrowHead2);

		const ctx = canvas.getCtx();
		ctx.save();
		this.applyStyles(ctx);
		ctx.beginPath();
		ctx.moveTo(arrowBaseCanvas.x, arrowBaseCanvas.y);
		ctx.lineTo(arrowTipCanvas.x, arrowTipCanvas.y);
		ctx.moveTo(arrowTipCanvas.x, arrowTipCanvas.y);
		ctx.lineTo(arrowHead1Canvas.x, arrowHead1Canvas.y);
		ctx.moveTo(arrowTipCanvas.x, arrowTipCanvas.y);
		ctx.lineTo(arrowHead2Canvas.x, arrowHead2Canvas.y);
		ctx.stroke();
		if (this.text) {
			ctx.textAlign = 'left';
			ctx.fillStyle = ctx.strokeStyle;
			ctx.fillText(this.text, arrowTipCanvas.x + 5, arrowTipCanvas.y);
		}
		ctx.closePath();
		ctx.restore();
	}
}
