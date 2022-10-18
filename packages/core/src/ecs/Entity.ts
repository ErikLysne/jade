import { Component, ComponentClass } from './Component';

export abstract class Entity {
	readonly id: number;
	readonly #components = new Map<ComponentClass, Component>();

	static isExternalConstruction = false;

	constructor(id: number) {
		if (!Entity.isExternalConstruction) {
			throw new TypeError(
				`Class ${this.constructor.name} cannot be constructed directly. To create a new Entity, use the createEntity method on ESC.`
			);
		}
		this.id = id;
	}

	abstract initialComponents: ComponentClass[];

	addComponent(ComponentClass: ComponentClass): Entity {
		this.#components.set(ComponentClass, new ComponentClass());
		return this;
	}

	addComponents(ComponentClasses: Iterable<ComponentClass>): Entity {
		for (const ComponentClass of ComponentClasses) {
			this.#components.set(ComponentClass, new ComponentClass());
		}
		return this;
	}

	deleteComponent(ComponentClass: ComponentClass): Entity {
		this.#components.delete(ComponentClass);
		return this;
	}

	setComponent<TComponent extends Component>(
		ComponentClass: ComponentClass<TComponent>
	): TComponent['set'] {
		let component = this.#components.get(ComponentClass);

		if (!component) {
			component =
				this.addComponent(ComponentClass).getComponent(ComponentClass);
		}
		return (...args: any[]) => component!.set(...args);
	}

	getComponent<TComponent extends Component>(
		ComponentClass: ComponentClass<TComponent>
	): TComponent {
		return this.#components.get(ComponentClass) as TComponent;
	}

	getComponents(): Map<Function, Component> {
		return this.#components;
	}

	hasComponent<TComponent extends Component>(
		ComponentClass: ComponentClass<TComponent>
	): boolean {
		return this.#components.has(ComponentClass);
	}

	hasAllComponents(ComponentClasses: Iterable<ComponentClass>): boolean {
		for (const ComponentClass of ComponentClasses) {
			if (!this.#components.has(ComponentClass)) {
				return false;
			}
		}

		return true;
	}
}

export type EntityClass<TEntity extends Entity> = new (
	...args: any[]
) => TEntity;
