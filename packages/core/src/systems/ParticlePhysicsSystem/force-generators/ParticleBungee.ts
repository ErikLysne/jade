import {
	ForceAccumulatorComponent,
	PositionComponent
} from '../../../components';
import { Entity } from '../../../engine';
import { Vector2 } from '../../../math';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleBungee implements ParticleForceGenerator {
	private other?: Entity;
	private springConstant: number = 0;
	private restLength: number = 0;

	setOther(other: Entity): this {
		this.other = other;
		return this;
	}

	getOther(): Entity | undefined {
		return this.other;
	}

	setSpringConstant(springConstant: number): this {
		this.springConstant = springConstant;
		return this;
	}

	getSpringConstant(): number {
		return this.springConstant;
	}

	setRestLength(restLength: number): this {
		this.restLength = restLength;
		return this;
	}

	getRestLength(): number {
		return this.restLength;
	}

	updateForce(entity: Entity): Vector2 | undefined {
		if (!this.other) {
			return;
		}

		const displacement = entity
			.getComponent(PositionComponent)
			.get()
			.subtract(this.other?.getComponent(PositionComponent).get());

		let magnitude = displacement.magnitude();

		if (magnitude <= this.restLength) {
			return;
		}

		magnitude = magnitude - this.restLength;
		magnitude *= this.springConstant;

		const force = displacement.normalize().scale(-magnitude);
		entity.getComponent(ForceAccumulatorComponent).addVector(force);
		return force;
	}
}
