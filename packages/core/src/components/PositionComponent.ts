import { Component } from '../engine';
import { Vector2 } from '../math';

export class PositionComponent extends Component {
	private position = new Vector2();

	setVector(v: Vector2): this {
		this.position = v.clone();
		return this;
	}

	set(x: number, y: number): this {
		this.position = new Vector2(x, y);
		return this;
	}

	get(): Vector2 {
		return this.position;
	}
}
