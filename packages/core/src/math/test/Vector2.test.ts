import { describeClass } from '../../test/describeClass';
import {
	expectVectorToBeCloseTo,
	expectVectorToEqual
} from '../../test/expectVector';
import { Vector2 } from '../Vector2';

const describeVector2 = describeClass(Vector2);

describe('Vector2', () => {
	it('is initialized to a (0,0) vector if no arguments are given', () => {
		const vector = new Vector2();

		expectVectorToEqual(vector, 0, 0);
	});

	it('is initialized to an (x,y) vector when x and y are given', () => {
		const vector = new Vector2(5, 10);

		expectVectorToEqual(vector, 5, 10);
	});
});

describeVector2('function: flip', () => {
	it('returns a vector with the x and y components flipped', () => {
		const originalVector = new Vector2(5, 10);
		const newVector = originalVector.flip();

		expectVectorToEqual(newVector, -5, -10);
	});
});

describeVector2('function: flipX', () => {
	it('returns a vector with the x component flipped', () => {
		const originalVector = new Vector2(5, 10);
		const newVector = originalVector.flipX();

		expectVectorToEqual(newVector, -5, 10);
	});
});

describeVector2('function: flipY', () => {
	it('returns a vector with the y component flipped', () => {
		const originalVector = new Vector2(5, 10);
		const newVector = originalVector.flipY();

		expectVectorToEqual(newVector, 5, -10);
	});
});

describeVector2('function: magnitude', () => {
	it('returns the magnitude of the vector', () => {
		const vector = new Vector2(3, 4);
		const magnitude = vector.magnitude();

		expect(magnitude).toEqual(5);
	});
});

describeVector2('function: magnitudeSquare', () => {
	it('returns the magnitude of the vector squared', () => {
		const vector = new Vector2(3, 4);
		const magnitudeSquare = vector.magnitudeSquare();

		expect(magnitudeSquare).toEqual(25);
	});
});

describeVector2('function: scale', () => {
	it('returns a vector with the the x and y values scaled by a scalar', () => {
		const originalVector = new Vector2(3, 4);
		const newVector = originalVector.scale(4);

		expectVectorToEqual(newVector, 12, 16);
	});
});

describeVector2('function: normalize', () => {
	it('returns a vector with the same direction and a magnitude of 1', () => {
		const originalVector = new Vector2(3, 4);
		const newVector = originalVector.normalize();

		const magnitude = newVector.magnitude();

		expect(magnitude).toEqual(1.0);
		expectVectorToBeCloseTo(newVector, 0.6, 0.8);
	});
});

describeVector2('function: add', () => {
	it('returns the vector sum', () => {
		const vector = new Vector2(3, 4);
		const operand = new Vector2(4, 5);
		const sum = vector.add(operand);

		expectVectorToEqual(sum, 7, 9);
	});
});

describeVector2('function: subtract', () => {
	it('returns the vector difference', () => {
		const vector = new Vector2(3, 4);
		const operand = new Vector2(4, 5);
		const difference = vector.subtract(operand);

		expectVectorToEqual(difference, -1, -1);
	});
});

describeVector2('function: componentProduct', () => {
	it('returns the component product', () => {
		const vector = new Vector2(3, 4);
		const operand = new Vector2(4, 5);
		const componentProduct = vector.componentProduct(operand);

		expectVectorToEqual(componentProduct, 12, 20);
	});
});

describeVector2('function: dot', () => {
	it('returns the scalar product', () => {
		const vector = new Vector2(3, 4);
		const operand = new Vector2(4, 5);
		const scalarProduct = vector.dot(operand);

		expect(scalarProduct).toEqual(32);
	});
});

describeVector2('function: rotate', () => {
	it('returns a vector rotated by the given angle', () => {
		const originalVector = new Vector2(3, 4);
		const newVector = originalVector.rotate(Math.PI / 2);

		expectVectorToBeCloseTo(newVector, -4, 3);
	});
});

describeVector2('function: operateOnComponents', () => {
	it('returns a vector with the absolute value of the components', () => {
		const originalVector = new Vector2(-3, -4);
		const newVector = originalVector.operateOnComponents(Math.abs);

		expectVectorToEqual(newVector, 3, 4);
	});
});

describeVector2('function: random', () => {
	it('returns a vector within the limits', () => {
		for (let i = 0; i < 100; i++) {
			const lowerLimit = new Vector2(2, 2);
			const upperLimit = new Vector2(4, 10);
			const randomVector = Vector2.random(lowerLimit, upperLimit);

			expect(randomVector.x).toBeGreaterThanOrEqual(2);
			expect(randomVector.x).toBeLessThanOrEqual(4);
			expect(randomVector.y).toBeGreaterThanOrEqual(2);
			expect(randomVector.y).toBeLessThanOrEqual(10);
		}
	});
});
