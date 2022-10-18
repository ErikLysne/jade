import {
	DampingComponent,
	MassComponent,
	PositionComponent
} from '../../components';
import { describeClass } from '../../test/describeClass';
import { ComponentClass } from '../Component';
import { ECS } from '../ECS';
import { Entity } from '../Entity';
import { System } from '../System';

const describeECS = describeClass(ECS);

let ecs: ECS;

beforeEach(() => {
	ecs = new ECS();
});

describeECS('function: createEntity', () => {
	class TestEntity extends Entity {
		initialComponents = [MassComponent, DampingComponent];
	}

	it('creates an entity and sets the id, starting from 1', () => {
		const entity1 = ecs.createEntity(TestEntity);
		const entity2 = ecs.createEntity(TestEntity);
		const entity3 = ecs.createEntity(TestEntity);

		expect(entity1.id).toEqual(1);
		expect(entity2.id).toEqual(2);
		expect(entity3.id).toEqual(3);
	});

	it('adds the initial components', () => {
		const entity = ecs.createEntity(TestEntity);

		expect(entity.getComponents().size).toEqual(2);
		expect(entity.getComponent(MassComponent)).toBeDefined();
		expect(entity.getComponent(DampingComponent)).toBeDefined();
	});

	it('adds the entity to the ESC', () => {
		const entity = ecs.createEntity(TestEntity);

		expect(ecs.getEntities().includes(entity)).toBe(true);
	});
});

describeECS('function: deleteEntity', () => {
	class TestEntity extends Entity {
		initialComponents = [];
	}

	it('marks the element for deletion', () => {
		const entity = ecs.createEntity(TestEntity);

		ecs.deleteEntity(entity);

		expect(ecs.getEntitiesMarkedForDeletion().includes(entity)).toBe(true);
	});
});

describeECS('function: getEntities', () => {
	class TestEntity extends Entity {
		initialComponents = [];
	}

	it('returns all entities', () => {
		const entity1 = ecs.createEntity(TestEntity);
		const entity2 = ecs.createEntity(TestEntity);

		const entities = ecs.getEntities();

		expect(entities.includes(entity1)).toBe(true);
		expect(entities.includes(entity2)).toBe(true);
	});
});

describeECS('function: createSystem', () => {
	it('throws an error if the system does not have any required components', () => {
		class TestSystem extends System {
			requiredComponents = new Set<ComponentClass>();
			update(): void {}
		}

		expect(() => ecs.createSystem(TestSystem)).toThrow();
	});

	it('creates the system and adds it to the ESC', () => {
		class TestSystem extends System {
			requiredComponents = new Set<ComponentClass>([
				MassComponent,
				DampingComponent
			]);
			update(): void {}
		}

		const system = ecs.createSystem(TestSystem);

		expect(ecs.getSystems().has(system)).toBe(true);
	});
});

describeECS('function: getSystemEntities', () => {
	it('returns the entities with the required components for the system', () => {
		class TestEntity extends Entity {
			initialComponents = [];
		}

		const entity1 = ecs.createEntity(TestEntity);
		const entity2 = ecs
			.createEntity(TestEntity)
			.addComponents([MassComponent]);
		const entity3 = ecs
			.createEntity(TestEntity)
			.addComponents([MassComponent, DampingComponent]);
		const entity4 = ecs
			.createEntity(TestEntity)
			.addComponents([
				MassComponent,
				DampingComponent,
				PositionComponent
			]);

		class TestSystem extends System {
			requiredComponents = new Set<ComponentClass>([
				MassComponent,
				DampingComponent
			]);
			update(): void {}
		}

		const system = ecs.createSystem(TestSystem);
		const systemEntities = ecs.getSystemEntities(system)!;

		expect(systemEntities.includes(entity1)).toBe(false);
		expect(systemEntities.includes(entity2)).toBe(false);
		expect(systemEntities.includes(entity3)).toBe(true);
		expect(systemEntities.includes(entity4)).toBe(true);
	});
});
