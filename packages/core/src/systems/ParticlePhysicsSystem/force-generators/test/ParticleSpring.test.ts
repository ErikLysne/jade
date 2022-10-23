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
import { ParticleSpring } from '../ParticleSpring';

const describeParticleSpring = describeClass(ParticleSpring);

const app = new Application({} as any);
const particle1 = app.createEntity(ParticleEntity);
const particle2 = app.createEntity(ParticleEntity);
const springConstant = 1.0;
const restLength = 10.0;
const particleSpring = new ParticleSpring()
	.setSpringConstant(springConstant)
	.setRestLength(restLength)
	.setOther(particle2);

beforeEach(() => {
	particle1.setComponent(MassComponent)(5.0);
	particle1.setComponent(PositionComponent)(0, 0);
	particle1.setComponent(VelocityComponent)(0, 0);
	particle1.getComponent(ForceAccumulatorComponent).clear();
	particle1.getComponent(ForceRegistryComponent).clear();

	particle2.setComponent(MassComponent)(5.0);
	particle2.setComponent(PositionComponent)(0, 0);
	particle2.setComponent(VelocityComponent)(0, 0);
	particle2.getComponent(ForceAccumulatorComponent).clear();
	particle2.getComponent(ForceRegistryComponent).clear();
});

describeParticleSpring('function: updateForce', () => {
	it('excerts a repulsive force when compressed', () => {
		particle2.setComponent(PositionComponent)(0, 0.5 * restLength);

		particleSpring.updateForce(particle1);

		const forceAcc = particle1.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toBeLessThan(0);
	});

	it('excerts an attractive force when extended', () => {
		particle2.setComponent(PositionComponent)(0, 2 * restLength);

		particleSpring.updateForce(particle1);

		const forceAcc = particle1.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toBeGreaterThan(0);
	});

	it('excerts no force at the rest length', () => {
		particle2.setComponent(PositionComponent)(0, restLength);

		particleSpring.updateForce(particle1);

		const forceAcc = particle1.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toEqual(0);
	});
});
