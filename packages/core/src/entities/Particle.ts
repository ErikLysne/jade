import {
	DampingComponent,
	ForceAccumulatorComponent,
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
		MassComponent,
		DampingComponent
	];
}
