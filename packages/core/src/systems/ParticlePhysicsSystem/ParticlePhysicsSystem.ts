import {
	DampingComponent,
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../components';
import { ComponentClass, Entity, System } from '../../ecs';

export class ParticlePhysicsSystem extends System {
	requiredComponents: Set<ComponentClass> = new Set([
		PositionComponent,
		VelocityComponent,
		ForceAccumulatorComponent,
		ForceRegistryComponent,
		MassComponent,
		DampingComponent
	]);

	#integrateEntity(entity: Entity, duration: number) {
		const position = entity.getComponent(PositionComponent);
		const velocity = entity.getComponent(VelocityComponent);
		const forceAccumulator = entity.getComponent(ForceAccumulatorComponent);
		const mass = entity.getComponent(MassComponent);
		const damping = entity.getComponent(DampingComponent);

		if (!mass.isFinite()) {
			return;
		}

		position.setVector(position.get().add(velocity.get().scale(duration)));

		const resultingAcceleration = forceAccumulator
			.get()
			.scale(mass.getInverse());

		velocity.setVector(
			velocity
				.get()
				.add(resultingAcceleration.scale(duration))
				.scale(Math.pow(damping.get(), duration))
		);
	}

	update(entities: Entity[], duration: number): void {
		for (const entity of entities) {
			entity.getComponent(ForceAccumulatorComponent).clear();
		}

		for (const entity of entities) {
			for (const forceGenerator of entity
				.getComponent(ForceRegistryComponent)
				.get()) {
				forceGenerator.updateForce(entity, duration);
			}
		}

		for (const entity of entities) {
			this.#integrateEntity(entity, duration);
		}
	}
}
