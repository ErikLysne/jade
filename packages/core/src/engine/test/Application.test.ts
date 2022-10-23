import {
	DampingComponent,
	MassComponent,
	PositionComponent
} from '../../components';
import { describeClass } from '../../test/describeClass';
import { Application } from '../Application';
import { ComponentClass } from '../Component';
import { Entity } from '../Entity';
import { System } from '../System';

const describeApplication = describeClass(Application);

let app: Application;

beforeEach(() => {
	app = new Application({} as any);
});

describeApplication('function: createEntity', () => {
	class TestEntity extends Entity {
		initialComponents = new Set([MassComponent, DampingComponent]);
	}

	it('creates an entity and sets the id, starting from 1', () => {
		const entity1 = app.createEntity(TestEntity);
		const entity2 = app.createEntity(TestEntity);
		const entity3 = app.createEntity(TestEntity);

		expect(entity1.id).toEqual(1);
		expect(entity2.id).toEqual(2);
		expect(entity3.id).toEqual(3);
	});

	it('adds the initial components', () => {
		const entity = app.createEntity(TestEntity);

		expect(entity.getComponents().size).toEqual(2);
		expect(entity.getComponent(MassComponent)).toBeDefined();
		expect(entity.getComponent(DampingComponent)).toBeDefined();
	});

	it('adds the entity to the ESC', () => {
		const entity = app.createEntity(TestEntity);

		expect(app.getEntities().includes(entity)).toBe(true);
	});
});

describeApplication('function: deleteEntity', () => {
	class TestEntity extends Entity {
		initialComponents = new Set([]);
	}

	it('marks the element for deletion', () => {
		const entity = app.createEntity(TestEntity);

		app.deleteEntity(entity);

		expect(app.getEntitiesMarkedForDeletion().includes(entity)).toBe(true);
	});
});

describeApplication('function: getEntities', () => {
	class TestEntity extends Entity {
		initialComponents = new Set([]);
	}

	it('returns all entities', () => {
		const entity1 = app.createEntity(TestEntity);
		const entity2 = app.createEntity(TestEntity);

		const entities = app.getEntities();

		expect(entities.includes(entity1)).toBe(true);
		expect(entities.includes(entity2)).toBe(true);
	});
});

describeApplication('function: createSystem', () => {
	it('creates the system and adds it to the ESC', () => {
		class TestSystem extends System {
			requiredComponents = new Set<ComponentClass>([
				MassComponent,
				DampingComponent
			]);
			update(): void {}
		}

		const system = app.createSystem(TestSystem);

		expect(app.getSystems().has(system)).toBe(true);
	});
});

describeApplication('function: getSystemEntities', () => {
	it('returns the entities with the required components for the system', () => {
		class TestEntity extends Entity {
			initialComponents = new Set([]);
		}

		const entity1 = app.createEntity(TestEntity);
		const entity2 = app
			.createEntity(TestEntity)
			.addComponents([MassComponent]);
		const entity3 = app
			.createEntity(TestEntity)
			.addComponents([MassComponent, DampingComponent]);
		const entity4 = app
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

		const system = app.createSystem(TestSystem);
		const systemEntities = app.getSystemEntities(system)!;

		expect(systemEntities.includes(entity1)).toBe(false);
		expect(systemEntities.includes(entity2)).toBe(false);
		expect(systemEntities.includes(entity3)).toBe(true);
		expect(systemEntities.includes(entity4)).toBe(true);
	});
});
