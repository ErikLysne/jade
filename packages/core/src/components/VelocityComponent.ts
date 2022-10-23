import { Component } from '../engine';
import { Vector2 } from '../math';

export class VelocityComponent extends Component {
	private velocity = new Vector2();

	setVector(v: Vector2): this {
		this.velocity = v.clone();
		return this;
	}

	set(x: number, y: number): this {
		this.velocity = new Vector2(x, y);
		return this;
	}

	get(): Vector2 {
		return this.velocity;
	}
}
