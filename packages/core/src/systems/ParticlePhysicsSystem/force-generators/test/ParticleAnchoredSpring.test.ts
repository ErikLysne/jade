import {
	ForceAccumulatorComponent,
	ForceRegistryComponent,
	MassComponent,
	PositionComponent,
	VelocityComponent
} from '../../../../components';
import { ECS } from '../../../../ecs';
import { Particle } from '../../../../entities';
import { Vector2 } from '../../../../math';
import { describeClass } from '../../../../test/describeClass';
import { ParticleAnchoredSpring } from '../ParticleAnchoredSpring';

const describeParticleAnchoredSpring = describeClass(ParticleAnchoredSpring);

const ecs = new ECS();
const particle = ecs.createEntity(Particle);
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
