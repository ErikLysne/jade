import { Component } from '../engine';
import { Shape } from '../systems';

export class ShapeComponent extends Component {
	private shape?: Shape = undefined;
	private priority = 0;

	get(): { shape: Shape | undefined; priority: number } {
		return { shape: this.shape, priority: this.priority };
	}

	set(shape: Shape, priority: number = 0): this {
		this.shape = shape;
		this.priority = priority;
		return this;
	}
}
