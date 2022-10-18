import { Entity } from '../../ecs';

export interface ParticleForceGenerator {
	updateForce(entity: Entity, duration: number): void;
}
