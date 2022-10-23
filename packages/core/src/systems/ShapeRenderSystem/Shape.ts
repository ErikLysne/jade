import { Canvas } from '../../graphics';
import { Vector2 } from '../../math';

export interface ShapeOptions {
	fillStyle?: CanvasFillStrokeStyles['fillStyle'];
	strokeStyle?: CanvasFillStrokeStyles['strokeStyle'];
	lineCap?: CanvasLineCap;
	lineDashOffset?: number;
	lineJoin?: CanvasLineJoin;
	lineWidth?: number;
	miterLimit?: number;
	shadowBlur?: number;
	shadowColor?: string;
	shadowOffsetX?: number;
	shadowOffsetY?: number;
}

export abstract class Shape implements ShapeOptions {
	public fillStyle?: CanvasFillStrokeStyles['fillStyle'];
	public strokeStyle?: CanvasFillStrokeStyles['strokeStyle'];
	public lineCap?: CanvasLineCap;
	public lineDashOffset?: number;
	public lineJoin?: CanvasLineJoin;
	public lineWidth?: number;
	public miterLimit?: number;
	public shadowBlur?: number;
	public shadowColor?: string;
	public shadowOffsetX?: number;
	public shadowOffsetY?: number;

	constructor(options: ShapeOptions) {
		Object.assign(this, options);
	}

	abstract render(canvas: Canvas, position: Vector2): void;

	applyStyle(ctx: CanvasRenderingContext2D, key: keyof ShapeOptions): void {
		if (this[key] != null) {
			(ctx[key] as Shape[keyof Shape]) = this[key];
		}
	}
	applyStyles(ctx: CanvasRenderingContext2D): void {
		this.applyStyle(ctx, 'fillStyle');
		this.applyStyle(ctx, 'strokeStyle');
		this.applyStyle(ctx, 'lineCap');
		this.applyStyle(ctx, 'lineDashOffset');
		this.applyStyle(ctx, 'lineJoin');
		this.applyStyle(ctx, 'lineWidth');
		this.applyStyle(ctx, 'miterLimit');
		this.applyStyle(ctx, 'shadowBlur');
		this.applyStyle(ctx, 'shadowColor');
		this.applyStyle(ctx, 'shadowOffsetX');
		this.applyStyle(ctx, 'shadowOffsetY');
	}
}
