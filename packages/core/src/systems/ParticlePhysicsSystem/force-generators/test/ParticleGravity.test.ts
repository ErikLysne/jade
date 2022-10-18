import {
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../../../components';
import { ECS } from '../../../../ecs';
import { Particle } from '../../../../entities';
import { describeClass } from '../../../../test/describeClass';
import { expectVectorToEqual } from '../../../../test/expectVector';
import { ParticleGravity } from '../ParticleGravity';

const describeParticleGravity = describeClass(ParticleGravity);

const ecs = new ECS();
const particle = ecs.createEntity(Particle);
const gravityAcceleration = -10;
const particleGravity = new ParticleGravity().setAcceleration(
	0,
	gravityAcceleration
);

beforeEach(() => {
	particle.setComponent(MassComponent)(5.0);
	particle.setComponent(PositionComponent)(0, 0);
	particle.setComponent(VelocityComponent)(0, 0);
	particle.getComponent(ForceAccumulatorComponent).clear();
	particle.getComponent(ForceRegistryComponent).clear();
});

describeParticleGravity('function: updateForce', () => {
	it('exerts a force in the direction of gravity', () => {
		let forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expectVectorToEqual(forceAcc.get(), 0, 0);

		particleGravity.updateForce(particle);
		forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expectVectorToEqual(
			forceAcc.get(),
			0,
			gravityAcceleration * particle.getComponent(MassComponent).get()!
		);
	});
});
