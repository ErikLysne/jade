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
import { ParticleBungee } from '../ParticleBungee';

const describeParticleBungee = describeClass(ParticleBungee);

const ecs = new ECS();
const particle1 = ecs.createEntity(Particle);
const particle2 = ecs.createEntity(Particle);
const springConstant = 1.0;
const restLength = 10.0;
const particleBungee = new ParticleBungee()
	.setSpringConstant(springConstant)
	.setRestLength(restLength)
	.setOther(particle2);

beforeEach(() => {
	particle1.setComponent(MassComponent)(5.0);
	particle1.setComponent(PositionComponent)(0, 0);
	particle1.setComponent(VelocityComponent)(0, 0);
	particle1.getComponent(ForceAccumulatorComponent).clear();
	particle1.getComponent(ForceRegistryComponent).clear();
});

describeParticleBungee('function: updateForce', () => {
	it('excerts no force when compressed', () => {
		particle2.setComponent(PositionComponent)(0, 0.5 * restLength);

		particleBungee.updateForce(particle1);

		const forceAcc = particle1.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toEqual(0);
	});

	it('excerts an attractive force when extended', () => {
		particle2.setComponent(PositionComponent)(0, 2 * restLength);

		particleBungee.updateForce(particle1);

		const forceAcc = particle1.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toBeGreaterThan(0);
	});

	it('excerts no force at the rest length', () => {
		particle2.setComponent(PositionComponent)(0, restLength);

		particleBungee.updateForce(particle1);

		const forceAcc = particle1.getComponent(ForceAccumulatorComponent);

		expect(forceAcc.get().y).toEqual(0);
	});
});
