import {
	ForceAccumulatorComponent,
	PositionComponent
} from '../../../components';
import { Entity } from '../../../ecs';
import { Vector2 } from '../../../math';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleAnchoredBungee implements ParticleForceGenerator {
	#anchor = new Vector2();
	#springConstant: number = 0;
	#restLength: number = 0;

	setAnchor(anchor: Vector2): ParticleAnchoredBungee {
		this.#anchor = anchor;
		return this;
	}

	getAnchor(): Vector2 {
		return this.#anchor;
	}

	setSpringConstant(value: number): ParticleAnchoredBungee {
		this.#springConstant = value;
		return this;
	}

	getSpringConstant(): number {
		return this.#springConstant;
	}

	setRestLength(value: number): ParticleAnchoredBungee {
		this.#restLength = value;
		return this;
	}

	getRestLength(): number {
		return this.#restLength;
	}

	updateForce(entity: Entity): void {
		const displacement = entity
			.getComponent(PositionComponent)
			.get()
			.subtract(this.#anchor);

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
