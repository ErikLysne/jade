import { Entity } from '../../ecs';
import { ParticleForceGenerator } from './ParticleForceGenerator';

export class ParticleForceRegistry {
	#registrations = new Map<Entity, Set<ParticleForceGenerator>>();

	getAll(): Map<Entity, Set<ParticleForceGenerator>> {
		return this.#registrations;
	}

	add(
		entity: Entity,
		forceGenerator: ParticleForceGenerator
	): ParticleForceRegistry {
		if (this.#registrations.has(entity)) {
			this.#registrations.get(entity)?.add(forceGenerator);
		} else {
			this.#registrations.set(entity, new Set([forceGenerator]));
		}
		return this;
	}

	remove(
		entity: Entity,
		forceGenerator: ParticleForceGenerator
	): ParticleForceRegistry {
		this.#registrations.get(entity)?.delete(forceGenerator);
		return this;
	}

	clear(): ParticleForceRegistry {
		this.#registrations.clear();
		return this;
	}

	updateForces(duration: number): ParticleForceRegistry {
		Array.from(this.#registrations.entries()).forEach(
			([entity, forceGenerators]) => {
				forceGenerators.forEach((forceGenerator) => {
					forceGenerator.updateForce(entity, duration);
				});
			}
		);
		return this;
	}
}
