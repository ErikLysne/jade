import { ForceAccumulatorComponent, MassComponent } from '../../../components';
import { Entity } from '../../../ecs';
import { Vector2 } from '../../../math';
import { ParticleForceGenerator } from '../ParticleForceGenerator';

export class ParticleGravity implements ParticleForceGenerator {
	#acceleration = new Vector2();

	setAccelerationVector(acceleration: Vector2): ParticleGravity {
		this.#acceleration = acceleration;
		return this;
	}

	setAcceleration(x: number, y: number): ParticleGravity {
		this.#acceleration = new Vector2(x, y);
		return this;
	}

	getAcceleration(): Vector2 {
		return this.#acceleration;
	}

	updateForce(entity: Entity): void {
		if (!entity.getComponent(MassComponent).isFinite()) {
			return;
		}

		entity
			.getComponent(ForceAccumulatorComponent)
			.addVector(
				this.#acceleration.scale(
					entity.getComponent(MassComponent).get()!
				)
			);
	}
}
