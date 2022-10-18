import { Component } from '../ecs';
import { Vector2 } from '../math';

export class ForceAccumulatorComponent extends Component {
	#forceAccumulator = new Vector2();

	addVector(v: Vector2): ForceAccumulatorComponent {
		this.#forceAccumulator = this.#forceAccumulator.add(v);
		return this;
	}

	set(x: number, y: number): ForceAccumulatorComponent {
		this.#forceAccumulator = new Vector2(x, y);
		return this;
	}

	get(): Vector2 {
		return this.#forceAccumulator;
	}

	clear(): ForceAccumulatorComponent {
		this.#forceAccumulator = new Vector2();
		return this;
	}
}
