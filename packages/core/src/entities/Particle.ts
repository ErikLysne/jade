import {
	DampingComponent,
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../components';
import { Entity } from '../ecs';

export class Particle extends Entity {
	initialComponents = [
		PositionComponent,
		VelocityComponent,
		ForceAccumulatorComponent,
		ForceRegistryComponent,
		MassComponent,
		DampingComponent
	];
}
