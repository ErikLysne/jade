import { ECS } from '../ecs';

export class JadeEngine extends ECS {
	readonly #framePeriod: number;

	#time: number = 0;
	#nextFrameTime: number = 0;
	#isRunning: boolean = false;

	constructor(frameInterval: number = 30.0) {
		super();
		this.#framePeriod = 1000 / frameInterval;
	}

	getTime(): number {
		return this.#time;
	}

	run() {
		this.#isRunning = true;
		this.gameLoop(0);
	}

	gameLoop(time: number) {
		if (!this.#isRunning) {
			return;
		}

		requestAnimationFrame((time) => this.gameLoop(time));

		const elapsed = time - this.#nextFrameTime;
		this.#time = time;

		if (elapsed >= this.#framePeriod) {
			this.#nextFrameTime = time - elapsed;

			this.updateSystems(this.#framePeriod / 1000);
		}
	}
}
