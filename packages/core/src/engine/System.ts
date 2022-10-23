import { Application } from './Application';
import { ComponentClass } from './Component';
import { Entity } from './Entity';

export abstract class System {
	readonly app: Application;
	public abstract readonly requiredComponents: Set<ComponentClass>;

	onSystemCreated?(): void;

	static isExternalConstruction = false;

	constructor(app: Application) {
		if (!System.isExternalConstruction) {
			throw new TypeError(
				`Class ${this.constructor.name} cannot be constructed directly. To create a new System, use the createSystem method on Application.`
			);
		}
		this.app = app;
	}

	abstract update(entities: Entity[], duration?: number): void;
}

export type SystemClass<TSystem extends System = System> = new (
	...args: any[]
) => TSystem;
