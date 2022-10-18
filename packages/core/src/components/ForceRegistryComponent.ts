import { Component } from '../ecs';
import { ParticleForceGenerator } from '../systems';

export class ForceRegistryComponent extends Component {
	#registrations = new Set<ParticleForceGenerator>();

	add(forceGenerator: ParticleForceGenerator): ForceRegistryComponent {
		this.#registrations.add(forceGenerator);
		return this;
	}

	remove(forceGenerator: ParticleForceGenerator): ForceRegistryComponent {
		this.#registrations.delete(forceGenerator);
		return this;
	}

	set(registration: Set<ParticleForceGenerator>): ForceRegistryComponent {
		this.#registrations = registration;
		return this;
	}

	get(): Set<ParticleForceGenerator> {
		return this.#registrations;
	}
}
