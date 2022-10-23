import {
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../../../components';
import { Application } from '../../../../engine';
import { ParticleEntity } from '../../../../entities';
import { describeClass } from '../../../../test/describeClass';
import { expectVectorToEqual } from '../../../../test/expectVector';
import { ParticleGravity } from '../ParticleGravity';

const describeParticleGravity = describeClass(ParticleGravity);

const app = new Application({} as any);
const particle = app.createEntity(ParticleEntity);
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
