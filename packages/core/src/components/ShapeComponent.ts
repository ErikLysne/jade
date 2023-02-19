import { Component } from '../engine';
import { Shape } from '../shapes';

export class ShapeComponent extends Component {
	private shape?: Shape = undefined;
	private renderPriority = 0;

	get(): { shape: Shape | undefined; renderPriority: number } {
		return { shape: this.shape, renderPriority: this.renderPriority };
	}

	set(shape: Shape, priority: number = 0): this {
		this.shape = shape;
		this.renderPriority = priority;
		return this;
	}
}
