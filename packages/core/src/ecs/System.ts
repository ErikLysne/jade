import { ComponentClass } from './Component';
import { ECS } from './ECS';
import { Entity } from './Entity';

export abstract class System {
	ecs: ECS;
	abstract requiredComponents: Set<ComponentClass>;

	constructor(ecs: ECS) {
		this.ecs = ecs;
	}

	abstract update(entities: Entity[], duration?: number): void;
}

export type SystemClass<TSystem extends System> = new (
	...args: any[]
) => TSystem;
