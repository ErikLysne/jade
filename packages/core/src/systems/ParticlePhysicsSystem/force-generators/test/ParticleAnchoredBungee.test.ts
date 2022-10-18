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
import { ParticleAnchoredBungee } from '../ParticleAnchoredBungee';

const describeParticleAnchoredBungee = describeClass(ParticleAnchoredBungee);

const ecs = new ECS();
const particle = ecs.createEntity(Particle);
const springConstant = 1.0;
const restLength = 10.0;
const anchor = new Vector2(0, 30);
const particleAnchoredBungee = new ParticleAnchoredBungee()
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

describeParticleAnchoredBungee('function: updateForce', () => {
	it('excerts no force when compressed', () => {
		particle
			.getComponent(PositionComponent)
			.setVector(anchor.subtract(new Vector2(0, 0.5 * restLength)));

		particleAnchoredBungee.updateForce(particle);

		const forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toEqual(0);
	});

	it('excerts an attractive force when extended', () => {
		particle
			.getComponent(PositionComponent)
			.setVector(anchor.subtract(new Vector2(0, 2 * restLength)));

		particleAnchoredBungee.updateForce(particle);

		const forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toBeGreaterThan(0);
	});

	it('excerts no force at the rest length', () => {
		particle
			.getComponent(PositionComponent)
			.setVector(anchor.subtract(new Vector2(0, restLength)));

		particleAnchoredBungee.updateForce(particle);

		const forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toEqual(0);
	});
});
