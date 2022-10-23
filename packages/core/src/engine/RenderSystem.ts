import { Canvas } from '../graphics';
import { Application } from './Application';
import { Entity } from './Entity';
import { System } from './System';

export abstract class RenderSystem extends System {
	protected readonly canvas: Canvas;

	constructor(app: Application, canvas: Canvas) {
		super(app);
		this.canvas = canvas;
	}

	abstract update(entities: Entity[]): void;
}
