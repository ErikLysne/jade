import {
	DampingComponent,
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../components';
import { ComponentClass, Entity, System } from '../../engine';

export class ParticlePhysicsSystem extends System {
	public requiredComponents: Set<ComponentClass> = new Set([
		PositionComponent,
		VelocityComponent,
		ForceAccumulatorComponent,
		ForceRegistryComponent,
		MassComponent,
		DampingComponent
	]);

	private integrateEntity(entity: Entity, duration: number) {
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
				const force = forceGenerator.updateForce(entity, duration);
				if (force) {
					entity
						.getComponent(ForceRegistryComponent)
						.setGeneratedForce(
							forceGenerator.constructor.name,
							force
						);
				}
			}
		}

		for (const entity of entities) {
			this.integrateEntity(entity, duration);
		}
	}
}
