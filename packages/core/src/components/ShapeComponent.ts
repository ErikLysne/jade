import { Component } from '../ecs';
import { Shape } from '../systems';

export class ShapeComponent extends Component {
	#shape?: Shape = undefined;

	get(): Shape | undefined {
		return this.#shape;
	}

	set(shape: Shape): ShapeComponent {
		this.#shape = shape;
		return this;
	}
}
