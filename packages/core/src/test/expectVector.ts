import { Vector2 } from '../math/Vector2';

export const expectVectorToEqual = (vector: Vector2, x: number, y: number) => {
	expect(vector.x).toEqual(x);
	expect(vector.y).toEqual(y);
};

export const expectVectorToBeCloseTo = (
	vector: Vector2,
	x: number,
	y: number,
	numDigits?: number
) => {
	expect(vector.x).toBeCloseTo(x, numDigits);
	expect(vector.y).toBeCloseTo(y, numDigits);
};
