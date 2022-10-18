import { DampingComponent, MassComponent } from '../../components';
import { describeClass } from '../../test/describeClass';
import { ECS } from '../ECS';
import { Entity } from '../Entity';

const describeEntity = describeClass(Entity);

let ecs: ECS;

beforeEach(() => {
	ecs = new ECS();
});

class TestEntity extends Entity {
	initialComponents = [];
}

describe('constructor', () => {
	it('cannot be constructed directly using its constructor', () => {
		expect(() => new TestEntity(1)).toThrow();
	});

	it('can be constructed through esc.createEntity', () => {
		const entity = ecs.createEntity(TestEntity);

		expect(entity instanceof TestEntity).toBe(true);
	});
});

describeEntity('function: addComponent', () => {
	it('adds the component to the component map', () => {
		const entity = ecs.createEntity(TestEntity).addComponent(MassComponent);

		expect(entity.hasComponent(MassComponent));
	});

	it('updates the component if it already exists', () => {
		const entity = ecs.createEntity(TestEntity).addComponent(MassComponent);
		let mass = entity.getComponent(MassComponent).set(10.0);

		expect(mass.get()).toEqual(10.0);

		entity.addComponent(MassComponent);
		mass = entity.getComponent(MassComponent).set(50.0);

		expect(mass.get()).toEqual(50.0);
	});
});

describeEntity('function: addComponents', () => {
	it('adds the components to the component map', () => {
		const entity = ecs
			.createEntity(TestEntity)
			.addComponents([MassComponent, DampingComponent]);

		expect(entity.hasAllComponents([MassComponent, DampingComponent])).toBe(
			true
		);
	});
});

describeEntity('function: deleteComponent', () => {
	it('deletes the component from the component map', () => {
		const entity = ecs
			.createEntity(TestEntity)
			.addComponents([MassComponent, DampingComponent]);
		entity.deleteComponent(MassComponent);

		const components = entity.getComponents();

		expect(components.has(MassComponent)).toBe(false);
		expect(components.has(DampingComponent)).toBe(true);
	});
});

describeEntity('function: setComponent', () => {
	it('sets the component', () => {
		const entity = ecs
			.createEntity(TestEntity)
			.addComponents([MassComponent]);

		entity.setComponent(MassComponent)(100);

		expect(entity.getComponent(MassComponent).get()).toEqual(100);
	});
});

describeEntity('function: getComponents', () => {
	it('returns all the components on the entity', () => {
		const entity = ecs
			.createEntity(TestEntity)
			.addComponent(MassComponent)
			.addComponent(DampingComponent);

		const components = entity.getComponents();

		expect(components.has(MassComponent)).toBe(true);
		expect(components.has(DampingComponent)).toBe(true);
	});
});

describeEntity('function: getComponent', () => {
	it('returns undefined if it does not exist on the entity', () => {
		const entity = ecs.createEntity(TestEntity);

		expect(entity.getComponent(MassComponent)).not.toBeDefined();
	});

	it('returns the component if it exists on the entity', () => {
		const entity = ecs.createEntity(TestEntity).addComponent(MassComponent);

		expect(entity.getComponent(MassComponent)).toBeDefined();
	});
});

describeEntity('function: hasComponent', () => {
	it('returns false if the entity does not have the component', () => {
		const entity = ecs.createEntity(TestEntity);

		expect(entity.hasComponent(MassComponent)).toBe(false);
	});

	it('returns true if the entity has the component', () => {
		const entity = ecs.createEntity(TestEntity).addComponent(MassComponent);

		expect(entity.hasComponent(MassComponent)).toBe(true);
	});
});

describeEntity('function: hasAllComponents', () => {
	it('returns false if the entity does not have all the components', () => {
		const entity = ecs.createEntity(TestEntity).addComponent(MassComponent);

		expect(entity.hasAllComponents([MassComponent, DampingComponent])).toBe(
			false
		);
	});

	it('returns true if the entity has all the components', () => {
		const entity = ecs
			.createEntity(TestEntity)
			.addComponents([MassComponent, DampingComponent]);

		expect(entity.hasAllComponents([MassComponent, DampingComponent])).toBe(
			true
		);
	});
});
