import { Component } from '../ecs';
import { Vector2 } from '../math';

export class VelocityComponent extends Component {
	#velocity = new Vector2();

	setVector(v: Vector2): VelocityComponent {
		this.#velocity = v.clone();
		return this;
	}

	set(x: number, y: number): VelocityComponent {
		this.#velocity = new Vector2(x, y);
		return this;
	}

	get(): Vector2 {
		return this.#velocity;
	}
}
