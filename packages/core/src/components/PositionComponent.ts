import { Component } from '../ecs';
import { Vector2 } from '../math';

export class PositionComponent extends Component {
	#position = new Vector2();

	setVector(v: Vector2): PositionComponent {
		this.#position = v.clone();
		return this;
	}

	set(x: number, y: number): PositionComponent {
		this.#position = new Vector2(x, y);
		return this;
	}

	get(): Vector2 {
		return this.#position;
	}
}
