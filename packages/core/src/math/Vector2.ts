export class Vector2 {
	readonly x: number;
	readonly y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;

		Object.freeze(this);
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	flip(): Vector2 {
		return new Vector2(-this.x, -this.y);
	}

	flipX(): Vector2 {
		return new Vector2(-this.x, this.y);
	}

	flipY(): Vector2 {
		return new Vector2(this.x, -this.y);
	}

	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	magnitudeSquare(): number {
		return this.x * this.x + this.y * this.y;
	}

	scale(value: number): Vector2 {
		return new Vector2(this.x * value, this.y * value);
	}

	normalize(): Vector2 {
		const length = this.magnitude();

		if (length > 0) {
			return this.clone().scale(1 / length);
		}

		return new Vector2();
	}

	add(v: Vector2): Vector2 {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	subtract(v: Vector2): Vector2 {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	componentProduct(v: Vector2): Vector2 {
		return new Vector2(this.x * v.x, this.y * v.y);
	}

	dot(v: Vector2): number {
		return this.x * v.x + this.y * v.y;
	}

	rotate(angle: number): Vector2 {
		return new Vector2(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle)
		);
	}

	operateOnComponents(operation: (component: number) => number): Vector2 {
		return new Vector2(operation(this.x), operation(this.y));
	}

	static random(min: Vector2, max: Vector2): Vector2 {
		return new Vector2(
			Math.random() * (max.x - min.x) + min.x,
			Math.random() * (max.y - min.y) + min.y
		);
	}
}
