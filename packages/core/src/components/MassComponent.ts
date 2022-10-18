import { Component } from '../ecs';

export class MassComponent extends Component {
	#inverseMass = 0;

	set(mass: number): MassComponent {
		if (mass > 0) {
			this.#inverseMass = 1 / mass;
		}

		return this;
	}

	setInfinite(): MassComponent {
		this.#inverseMass = 0;
		return this;
	}

	get(): number | null {
		if (this.#inverseMass > 0) {
			return 1 / this.#inverseMass;
		}

		return null;
	}

	getInverse(): number {
		return this.#inverseMass;
	}

	isFinite(): boolean {
		return this.#inverseMass > 0;
	}
}
