import { Component } from '../engine';
import { Vector2 } from '../math';
import { ParticleForceGenerator } from '../systems';

export class ForceRegistryComponent extends Component {
	private registrations = new Set<ParticleForceGenerator>();
	private generatedForces = new Map<string, Vector2>();

	add(forceGenerator: ParticleForceGenerator): this {
		this.registrations.add(forceGenerator);
		return this;
	}

	remove(forceGenerator: ParticleForceGenerator): this {
		this.registrations.delete(forceGenerator);
		return this;
	}

	clear(): this {
		this.registrations = new Set();
		return this;
	}

	set(registration: Set<ParticleForceGenerator>): this {
		this.registrations = registration;
		return this;
	}

	get(): Set<ParticleForceGenerator> {
		return this.registrations;
	}

	setGeneratedForce(forceType: string, force: Vector2): this {
		this.generatedForces.set(forceType, force);
		return this;
	}

	getGeneratedForces(): Map<string, Vector2> {
		return this.generatedForces;
	}
}
