import { Component } from '../engine';

export class MassComponent extends Component {
	private inverseMass = 0;

	set(mass: number): this {
		if (mass > 0) {
			this.inverseMass = 1 / mass;
		}

		return this;
	}

	setInfinite(): this {
		this.inverseMass = 0;
		return this;
	}

	get(): number | null {
		if (this.inverseMass > 0) {
			return 1 / this.inverseMass;
		}

		return null;
	}

	getInverse(): number {
		return this.inverseMass;
	}

	isFinite(): boolean {
		return this.inverseMass > 0;
	}
}
