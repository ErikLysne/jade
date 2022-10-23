import {
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../../../components';
import { Application } from '../../../../engine';
import { ParticleEntity } from '../../../../entities';
import { Vector2 } from '../../../../math';
import { describeClass } from '../../../../test/describeClass';
import { ParticleAnchoredSpring } from '../ParticleAnchoredSpring';

const describeParticleAnchoredSpring = describeClass(ParticleAnchoredSpring);

const app = new Application({} as any);
const particle = app.createEntity(ParticleEntity);
const springConstant = 1.0;
const restLength = 10.0;
const anchor = new Vector2(0, 30);
const particleAnchoredSpring = new ParticleAnchoredSpring()
	.setSpringConstant(springConstant)
	.setRestLength(restLength)
	.setAnchor(anchor);

beforeEach(() => {
	particle.setComponent(MassComponent)(5.0);
	particle.setComponent(PositionComponent)(0, 0);
	particle.setComponent(VelocityComponent)(0, 0);
	particle.getComponent(ForceAccumulatorComponent).clear();
	particle.getComponent(ForceRegistryComponent).clear();
});

describeParticleAnchoredSpring('function: updateForce', () => {
	it('excerts a repulsive force when compressed', () => {
		particle
			.getComponent(PositionComponent)
			.setVector(anchor.subtract(new Vector2(0, 0.5 * restLength)));

		particleAnchoredSpring.updateForce(particle);

		const forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toBeLessThan(0);
	});

	it('excerts an attractive force when extended', () => {
		particle
			.getComponent(PositionComponent)
			.setVector(anchor.subtract(new Vector2(0, 2 * restLength)));

		particleAnchoredSpring.updateForce(particle);

		const forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toBeGreaterThan(0);
	});

	it('excerts no force at the rest length', () => {
		particle
			.getComponent(PositionComponent)
			.setVector(anchor.subtract(new Vector2(0, restLength)));

		particleAnchoredSpring.updateForce(particle);

		const forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toEqual(0);
	});
});
