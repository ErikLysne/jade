import {
	ForceAccumulatorComponent,
	PositionComponent
} from '../../../components';
import { Entity } from '../../../ecs';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleSpring implements ParticleForceGenerator {
	#other?: Entity;
	#springConstant: number = 0;
	#restLength: number = 0;

	setOther(other: Entity): ParticleSpring {
		this.#other = other;
		return this;
	}

	getOther(): Entity | undefined {
		return this.#other;
	}

	setSpringConstant(value: number): ParticleSpring {
		this.#springConstant = value;
		return this;
	}

	getSpringConstant(): number {
		return this.#springConstant;
	}

	setRestLength(value: number): ParticleSpring {
		this.#restLength = value;
		return this;
	}

	getRestLength(): number {
		return this.#restLength;
	}

	updateForce(entity: Entity): void {
		if (!this.#other) {
			return;
		}

		const displacement = entity
			.getComponent(PositionComponent)
			.get()
			.subtract(this.#other?.getComponent(PositionComponent).get());

		let magnitude = displacement.magnitude();
		magnitude = magnitude - this.#restLength;
		magnitude *= this.#springConstant;

		const force = displacement.normalize().scale(-magnitude);
		entity.getComponent(ForceAccumulatorComponent).addVector(force);
	}
}
