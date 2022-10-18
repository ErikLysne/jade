import {
	ForceAccumulatorComponent,
	PositionComponent
} from '../../../components';
import { Entity } from '../../../ecs';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleBungee implements ParticleForceGenerator {
	#other?: Entity;
	#springConstant: number = 0;
	#restLength: number = 0;

	setOther(other: Entity): ParticleBungee {
		this.#other = other;
		return this;
	}

	getOther(): Entity | undefined {
		return this.#other;
	}

	setSpringConstant(springConstant: number): ParticleBungee {
		this.#springConstant = springConstant;
		return this;
	}

	getSpringConstant(): number {
		return this.#springConstant;
	}

	setRestLength(restLength: number): ParticleBungee {
		this.#restLength = restLength;
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

		if (magnitude <= this.#restLength) {
			return;
		}

		magnitude = magnitude - this.#restLength;
		magnitude *= this.#springConstant;

		const force = displacement.normalize().scale(-magnitude);
		entity.getComponent(ForceAccumulatorComponent).addVector(force);
	}
}
