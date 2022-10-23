import {
	ForceAccumulatorComponent,
	PositionComponent
} from '../../../components';
import { Entity } from '../../../engine';
import { Vector2 } from '../../../math';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleAnchoredSpring implements ParticleForceGenerator {
	private anchor = new Vector2();
	private springConstant: number = 0;
	private restLength: number = 0;

	setAnchor(anchor: Vector2): this {
		this.anchor = anchor;
		return this;
	}

	getAnchor(): Vector2 {
		return this.anchor;
	}

	setSpringConstant(value: number): this {
		this.springConstant = value;
		return this;
	}

	getSpringConstant(): number {
		return this.springConstant;
	}

	setRestLength(value: number): this {
		this.restLength = value;
		return this;
	}

	getRestLength(): number {
		return this.restLength;
	}

	updateForce(entity: Entity): Vector2 | undefined {
		const displacement = entity
			.getComponent(PositionComponent)
			.get()
			.subtract(this.anchor);

		let magnitude = displacement.magnitude() - this.restLength;
		magnitude *= this.springConstant;

		const force = displacement.normalize().scale(-magnitude);
		entity.getComponent(ForceAccumulatorComponent).addVector(force);
		return force;
	}
}
