import { Entity } from '../../engine';
import { Vector2 } from '../../math';

export interface ParticleForceGenerator {
	updateForce(entity: Entity, duration: number): Vector2 | undefined;
}
