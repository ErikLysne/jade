import {
	ForceAccumulatorComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../../../components';
import { ECS } from '../../../../ecs';
import { Particle } from '../../../../entities';
import { describeClass } from '../../../../test/describeClass';
import { expectVectorToEqual } from '../../../../test/expectVector';
import { ParticleForceRegistry } from '../../ParticleForceRegistry';
import { ParticleGravity } from '../ParticleGravity';

const describeParticleGravity = describeClass(ParticleGravity);

const ecs = new ECS();
const particle = ecs.createEntity(Particle);
const gravityAcceleration = -10;
const particleGravity = new ParticleGravity().set(0, gravityAcceleration);
const particleForceRegistry = new ParticleForceRegistry();
particleForceRegistry.add(particle, particleGravity);

beforeEach(() => {
	particle.setComponent(MassComponent)(5.0);
	particle.setComponent(PositionComponent)(0, 0);
	particle.setComponent(VelocityComponent)(0, 0);
	particle.getComponent(ForceAccumulatorComponent).clear();
});

describeParticleGravity('function: updateForce', () => {
	it('exerts a force in the direction of gravity', () => {
		let forceAcc = particle.getComponent(ForceAccumulatorComponent).get();

		expectVectorToEqual(forceAcc, 0, 0);

		particleForceRegistry.updateForces(0);
		forceAcc = particle.getComponent(ForceAccumulatorComponent).get();

		expectVectorToEqual(
			forceAcc,
			0,
			gravityAcceleration * particle.getComponent(MassComponent).get()!
		);
	});
});
