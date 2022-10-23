import {
	ForceAccumulatorComponent,
	VelocityComponent
} from '../../../components';
import { Entity } from '../../../engine';
import { Vector2 } from '../../../math';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleDrag implements ParticleForceGenerator {
	private k1: number = 0;
	private k2: number = 0;

	setK1(k1: number): this {
		this.k1 = k1;
		return this;
	}

	getK1(): number {
		return this.k1;
	}

	setK2(k2: number): this {
		this.k2 = k2;
		return this;
	}

	getK2(): number {
		return this.k2;
	}

	updateForce(entity: Entity): Vector2 | undefined {
		const velocity = entity.getComponent(VelocityComponent);

		let dragCoefficient = velocity.get().magnitude();
		dragCoefficient =
			this.k1 * dragCoefficient +
			this.k2 * dragCoefficient * dragCoefficient;

		const force = velocity.get().normalize().scale(-dragCoefficient);
		entity.getComponent(ForceAccumulatorComponent).addVector(force);
		return force;
	}
}
