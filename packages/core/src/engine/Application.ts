import { Canvas } from '../graphics';
import { Entity, EntityClass } from './Entity';
import { EventManager } from './EventManager';
import { RenderSystem } from './RenderSystem';
import { System, SystemClass } from './System';

interface UpdateSystemsPhaseEvents {
	started: {
		timestamp: number;
	};
	finished: {
		timestamp: number;
		elapsedTime: number;
		remainingTime: number;
	};
}

interface UpdateSystemEvents {
	started: {
		timestamp: number;
		system: System;
		name: string;
	};
	finished: {
		timestamp: number;
		system: System;
		name: string;
		elapsedTime: number;
	};
}

export class Application {
	private readonly entities: Entity[] = [];
	private entitiesMarkedForDeletion: Entity[] = [];

	private readonly systems = new Set<System>();
	private readonly renderSystems = new Set<RenderSystem>();

	private nextEntityId = 1;

	private readonly systemUpdateTimeStep: number;
	private isRunning = false;
	private simulationInterval?: ReturnType<typeof setTimeout>;
	private readonly canvas: Canvas;
	private readonly renderQueue = new Map<(canvas: Canvas) => void, number>();

	public readonly eventManager = {
		updateSystemsPhase: new EventManager<UpdateSystemsPhaseEvents>(),
		updateSystem: new EventManager<UpdateSystemEvents>(),
		updateRenderSystemsPhase: new EventManager<UpdateSystemsPhaseEvents>(),
		updateRenderSystem: new EventManager<UpdateSystemEvents>()
	};

	constructor(options: { systemUpdateFrequency: number; canvas: Canvas }) {
		const { systemUpdateFrequency, canvas } = options;

		this.systemUpdateTimeStep = 1000 / systemUpdateFrequency;
		this.canvas = canvas;
	}

	getCanvas() {
		return this.canvas;
	}

	// Engine
	simulationLoop(duration: number): void {
		if (!this.isRunning) {
			return;
		}

		this.updateSystems(duration);
	}

	renderLoop(): void {
		if (!this.isRunning) {
			return;
		}

		this.renderQueue.clear();
		this.updateRenderSystems();
		this.canvas.clear().renderBackground();
		[...this.renderQueue.entries()]
			.sort(([_, priorityA], [__, priorityB]) => priorityA - priorityB)
			.forEach(([callback]) => callback(this.canvas));

		requestAnimationFrame(() => this.renderLoop());
	}

	queueRendering(
		renderer: (canvas: Canvas) => void,
		priority: number = 0
	): void {
		this.renderQueue.set(renderer, priority);
	}

	run(): void {
		this.isRunning = true;

		this.simulationInterval = setInterval(() => {
			this.simulationLoop(this.systemUpdateTimeStep / 1000);
		}, this.systemUpdateTimeStep);

		requestAnimationFrame(() => this.renderLoop());
	}

	stop() {
		this.isRunning = false;
		clearInterval(this.simulationInterval);
	}

	// Entities
	createEntity<TEntity extends Entity>(
		EntityClass: EntityClass<TEntity>
	): TEntity {
		Entity.isExternalConstruction = true;
		const entity = new EntityClass(this.nextEntityId++);
		Entity.isExternalConstruction = false;

		entity.onEntityCreated?.();

		for (const Component of entity.initialComponents) {
			entity.addComponent(Component);
		}

		this.entities.push(entity);

		return entity;
	}

	deleteEntity(entity: Entity): void {
		this.entitiesMarkedForDeletion.push(entity);
	}

	getEntities(): Entity[] {
		return this.entities;
	}

	getEntitiesMarkedForDeletion(): Entity[] {
		return this.entitiesMarkedForDeletion;
	}

	// Systems
	createSystem<TSystem extends System>(
		SystemClass: SystemClass<TSystem>
	): TSystem {
		System.isExternalConstruction = true;
		const system = new SystemClass(this, this.canvas);
		System.isExternalConstruction = false;

		system.onSystemCreated?.();

		if (system instanceof RenderSystem) {
			this.renderSystems.add(system);
		} else {
			this.systems.add(system);
		}

		return system;
	}

	getSystems(): Set<System> {
		return this.systems;
	}

	getSystemEntities(system: System): Entity[] {
		return this.entities.filter((entity) =>
			entity.hasAllComponents(system.requiredComponents)
		);
	}

	updateSystems(time: number): void {
		const updateSystemPhaseStartedTimestamp = performance.now();
		this.eventManager.updateSystemsPhase.dispatch('started', {
			timestamp: updateSystemPhaseStartedTimestamp
		});

		for (const system of this.systems) {
			const updateSystemStartedTimestamp = performance.now();
			this.eventManager.updateSystem.dispatch('started', {
				timestamp: updateSystemStartedTimestamp,
				system: system,
				name: system.constructor.name
			});

			const entities = this.getSystemEntities(system);
			system.update(entities, time);

			const updateSystemFinishedTimestamp = performance.now();
			const elapsedTime =
				updateSystemFinishedTimestamp - updateSystemStartedTimestamp;
			this.eventManager.updateSystem.dispatch('finished', {
				timestamp: performance.now(),
				system: system,
				name: system.constructor.name,
				elapsedTime: elapsedTime
			});
		}

		this.entitiesMarkedForDeletion.forEach((entity) => {
			this.entities.splice(this.entities.indexOf(entity), 1);
		});

		this.entitiesMarkedForDeletion = [];

		const updateSystemPhaseFinishedTimestamp = performance.now();
		const elapsedTime =
			updateSystemPhaseFinishedTimestamp -
			updateSystemPhaseStartedTimestamp;
		this.eventManager.updateSystemsPhase.dispatch('finished', {
			timestamp: updateSystemPhaseFinishedTimestamp,
			elapsedTime,
			remainingTime: 1000 * time - elapsedTime
		});
	}

	updateRenderSystems(): void {
		const updateRenderSystemPhaseStartedTimestamp = performance.now();
		this.eventManager.updateRenderSystemsPhase.dispatch('started', {
			timestamp: updateRenderSystemPhaseStartedTimestamp
		});

		for (const system of this.renderSystems) {
			const updateRenderSystemStartedTimestamp = performance.now();
			this.eventManager.updateRenderSystem.dispatch('started', {
				timestamp: updateRenderSystemStartedTimestamp,
				system: system,
				name: system.constructor.name
			});

			const entities = this.getSystemEntities(system);
			system.update(entities);

			const updateRenderSystemFinishedTimestamp = performance.now();
			const elapsedTime =
				updateRenderSystemFinishedTimestamp -
				updateRenderSystemStartedTimestamp;
			this.eventManager.updateRenderSystem.dispatch('finished', {
				timestamp: updateRenderSystemFinishedTimestamp,
				system: system,
				name: system.constructor.name,
				elapsedTime
			});
		}

		const updateRenderSystemPhaseFinishedTimestamp = performance.now();
		const elapsedTime =
			updateRenderSystemPhaseFinishedTimestamp -
			updateRenderSystemPhaseStartedTimestamp;
		this.eventManager.updateRenderSystemsPhase.dispatch('finished', {
			timestamp: updateRenderSystemPhaseFinishedTimestamp,
			elapsedTime,
			remainingTime: 0
		});
	}
}
