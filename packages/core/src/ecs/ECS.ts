import { Entity, EntityClass } from './Entity';
import { System, SystemClass } from './System';

export class ECS {
	#entities: Entity[] = [];
	#systems = new Set<System>();

	#nextEntityId = 1;
	#entitiesMarkedForDeletion: Entity[] = [];

	// Entities
	createEntity<TEntity extends Entity>(
		EntityClass: EntityClass<TEntity>
	): TEntity {
		Entity.isExternalConstruction = true;
		const entity = new EntityClass(this.#nextEntityId++);
		Entity.isExternalConstruction = false;

		for (const Component of entity.initialComponents) {
			entity.addComponent(Component);
		}

		this.#entities.push(entity);

		return entity;
	}

	deleteEntity(entity: Entity): void {
		this.#entitiesMarkedForDeletion.push(entity);
	}

	getEntities(): Entity[] {
		return this.#entities;
	}

	getEntitiesMarkedForDeletion(): Entity[] {
		return this.#entitiesMarkedForDeletion;
	}

	// Systems
	createSystem<TSystem extends System>(
		SystemClass: SystemClass<TSystem>
	): TSystem {
		const system = new SystemClass(this);

		const { requiredComponents } = system;

		if (requiredComponents.size === 0) {
			throw new Error(
				`System ${system.constructor.name} was not added to ESC: requiredComponents is empty.`
			);
		}

		this.#systems.add(system);

		return system;
	}

	getSystems(): Set<System> {
		return this.#systems;
	}

	getSystemEntities(system: System): Entity[] {
		return this.#entities.filter((entity) =>
			entity.hasAllComponents(system.requiredComponents)
		);
	}

	updateSystems(duration: number): void {
		for (const system of this.#systems) {
			const entities = this.getSystemEntities(system);
			system.update(entities, duration);
		}

		this.#entitiesMarkedForDeletion.forEach((entity) => {
			this.#entities.splice(this.#entities.indexOf(entity), 1);
		});

		this.#entitiesMarkedForDeletion = [];
	}
}
