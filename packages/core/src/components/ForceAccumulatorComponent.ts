import { Component } from '../engine';
import { Vector2 } from '../math';

export class ForceAccumulatorComponent extends Component {
	private forceAccumulator = new Vector2();

	addVector(v: Vector2): this {
		this.forceAccumulator = this.forceAccumulator.add(v);
		return this;
	}

	set(x: number, y: number): this {
		this.forceAccumulator = new Vector2(x, y);
		return this;
	}

	get(): Vector2 {
		return this.forceAccumulator;
	}

	clear(): this {
		this.forceAccumulator = new Vector2();
		return this;
	}
}
