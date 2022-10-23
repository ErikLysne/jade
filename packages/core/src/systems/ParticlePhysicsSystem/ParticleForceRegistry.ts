import { Entity } from '../../engine';
import { ParticleForceGenerator } from './ParticleForceGenerator';

export class ParticleForceRegistry {
	private readonly registrations = new Map<
		Entity,
		Set<ParticleForceGenerator>
	>();

	getAll(): Map<Entity, Set<ParticleForceGenerator>> {
		return this.registrations;
	}

	add(entity: Entity, forceGenerator: ParticleForceGenerator): this {
		if (this.registrations.has(entity)) {
			this.registrations.get(entity)?.add(forceGenerator);
		} else {
			this.registrations.set(entity, new Set([forceGenerator]));
		}
		return this;
	}

	remove(entity: Entity, forceGenerator: ParticleForceGenerator): this {
		this.registrations.get(entity)?.delete(forceGenerator);
		return this;
	}

	clear(): this {
		this.registrations.clear();
		return this;
	}

	updateForces(duration: number): this {
		Array.from(this.registrations.entries()).forEach(
			([entity, forceGenerators]) => {
				forceGenerators.forEach((forceGenerator) => {
					forceGenerator.updateForce(entity, duration);
				});
			}
		);
		return this;
	}
}
