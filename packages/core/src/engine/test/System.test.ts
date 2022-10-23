import { Application } from '../Application';
import { Entity } from '../Entity';
import { System } from '../System';

let app: Application;

beforeEach(() => {
	app = new Application({} as any);
});

const mockOnSystemCreated = jest.fn(() => {});

class TestSystem extends System {
	requiredComponents = new Set([]);

	update(entities: Entity[], duration?: number | undefined): void {}

	onSystemCreated = mockOnSystemCreated;
}

describe('constructor', () => {
	it('cannot be constructed directly using its constructor', () => {
		expect(() => new TestSystem(app)).toThrow();
	});

	it('can be constructed with app.createSystem', () => {
		const system = app.createSystem(TestSystem);

		expect(system instanceof TestSystem).toBe(true);
	});

	it('calls onSystemCreated when created', () => {
		app.createSystem(TestSystem);

		expect(mockOnSystemCreated).toHaveBeenCalled();
	});
});
