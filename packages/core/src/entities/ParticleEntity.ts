import {
	DampingComponent,
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../components';
import { Entity } from '../engine';

export class ParticleEntity extends Entity {
	initialComponents = new Set([
		PositionComponent,
		VelocityComponent,
		ForceAccumulatorComponent,
		ForceRegistryComponent,
		MassComponent,
		DampingComponent
	]);
}
