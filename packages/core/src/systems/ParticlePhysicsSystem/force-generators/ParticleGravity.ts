import { ForceAccumulatorComponent, MassComponent } from '../../../components';
import { Entity } from '../../../engine';
import { Vector2 } from '../../../math';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleGravity implements ParticleForceGenerator {
	private acceleration = new Vector2();

	setAccelerationVector(acceleration: Vector2): this {
		this.acceleration = acceleration;
		return this;
	}

	setAcceleration(x: number, y: number): this {
		this.acceleration = new Vector2(x, y);
		return this;
	}

	getAcceleration(): Vector2 {
		return this.acceleration;
	}

	updateForce(entity: Entity): Vector2 | undefined {
		if (!entity.getComponent(MassComponent).isFinite()) {
			return;
		}

		const force = this.acceleration.scale(
			entity.getComponent(MassComponent).get()!
		);
		entity.getComponent(ForceAccumulatorComponent).addVector(force);
		return force;
	}
}
