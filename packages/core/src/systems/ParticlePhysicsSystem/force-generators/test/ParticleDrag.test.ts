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
import { ParticleDrag } from '../ParticleDrag';

const describeParticleDrag = describeClass(ParticleDrag);

const ecs = new ECS();
const particle = ecs.createEntity(Particle);
const k1 = 0.5;
const k2 = 0.1;
const particleDrag = new ParticleDrag().setK1(k1).setK2(k2);

beforeEach(() => {
	particle.setComponent(MassComponent)(5.0);
	particle.setComponent(PositionComponent)(0, 0);
	particle.setComponent(VelocityComponent)(10, 20);
	particle.getComponent(ForceAccumulatorComponent).clear();
	particle.getComponent(ForceRegistryComponent).clear();
});

describeParticleDrag('function: updateForce', () => {
	it('excerts a force against the direction of movement', () => {
		const velocity = particle.getComponent(VelocityComponent);
		let forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expectVectorToEqual(forceAcc.get(), 0, 0);

		particleDrag.updateForce(particle);
		forceAcc = particle.getComponent(ForceAccumulatorComponent);

		expect(
			velocity.get().normalize().dot(forceAcc.get().normalize())
		).toBeCloseTo(-1);
	});
});
