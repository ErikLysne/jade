import {
	ForceAccumulatorComponent,
	VelocityComponent
} from '../../../components';
import { Entity } from '../../../ecs';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleDrag implements ParticleForceGenerator {
	#k1: number = 0;
	#k2: number = 0;

	setK1(k1: number): ParticleDrag {
		this.#k1 = k1;
		return this;
	}

	getK1(): number {
		return this.#k1;
	}

	setK2(k2: number): ParticleDrag {
		this.#k2 = k2;
		return this;
	}

	getK2(): number {
		return this.#k2;
	}

	updateForce(entity: Entity): void {
		const velocity = entity.getComponent(VelocityComponent);

		let dragCoefficient = velocity.get().magnitude();
		dragCoefficient =
			this.#k1 * dragCoefficient +
			this.#k2 * dragCoefficient * dragCoefficient;

		entity
			.getComponent(ForceAccumulatorComponent)
			.addVector(velocity.get().normalize().scale(-dragCoefficient));
	}
}
