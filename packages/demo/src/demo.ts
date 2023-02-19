import {
	Application,
	Canvas,
	Circle,
	ClickableComponent,
	Component,
	DampingComponent,
	Entity,
	ForceRegistryComponent,
	Line,
	MassComponent,
	MouseInputSystem,
	ParticleAnchoredSpring,
	ParticleDrag,
	ParticleEntity,
	ParticleGravity,
	ParticlePhysicsSystem,
	PositionComponent,
	RenderSystem,
	ShapeComponent,
	ShapeRenderSystem,
	Vector2,
	VelocityComponent
} from '@jade/core';
import {
	ForceRenderSystem,
	ProfilerSystem,
	VelocityRenderSystem
} from '@jade/dev-tools';

const root = document.getElementById('app');
const canvasElement = Canvas.createElement(root);

const canvas = new Canvas({
	canvasElement,
	width: 1024,
	height: 512
});

const app = new Application({
	canvas,
	systemUpdateFrequency: 60
});

class SpringComponent extends Component {
	#attachedEntity?: Entity;

	get() {
		return this.#attachedEntity;
	}
	set(entity: Entity) {
		this.#attachedEntity = entity;
	}
}

class SpringEntity extends Entity {
	initialComponents = new Set([SpringComponent, PositionComponent]);
}

class SpringRenderSystem extends RenderSystem {
	requiredComponents = new Set([SpringComponent, PositionComponent]);

	update(entities: Entity[]): void {
		for (const entity of entities) {
			const spring = entity.getComponent(SpringComponent);
			const position = entity.getComponent(PositionComponent);

			if (!spring.get()) {
				return;
			}

			const shape = new Line({
				startPosition: position.get(),
				endPosition: spring.get()!.getComponent(PositionComponent).get()
			});

			this.app.queueRendering((canvas) => {
				shape.render(this.canvas, position.get());
			});
		}
	}
}

const gravity = new ParticleGravity().setAcceleration(0, -100);
const anchoredSpring = new ParticleAnchoredSpring()
	.setAnchor(new Vector2(512, 300))
	.setRestLength(100)
	.setSpringConstant(50);
const drag = new ParticleDrag().setK1(0.1).setK2(0.01);

const particle = app.createEntity(ParticleEntity);
particle.setComponent(PositionComponent)(256, 128);
particle.setComponent(VelocityComponent)(10, 10);
particle.setComponent(MassComponent)(10.0);
particle.setComponent(DampingComponent)(0.95);
particle.setComponent(ShapeComponent)(
	new Circle({
		radius: 10,
		renderOptions: {
			fillStyle: 'red'
		}
	}),
	200
);
particle
	.getComponent(ForceRegistryComponent)
	.add(gravity)
	.add(anchoredSpring)
	.add(drag);
particle.addComponent(ClickableComponent);

const spring = app.createEntity(SpringEntity);
spring.setComponent(SpringComponent)(particle);
spring.setComponent(PositionComponent)(
	anchoredSpring.getAnchor().x,
	anchoredSpring.getAnchor().y
);

app.createSystem(ParticlePhysicsSystem);
app.createSystem(ShapeRenderSystem);
app.createSystem(SpringRenderSystem);
app.createSystem(MouseInputSystem);

// dev tools;
app.createSystem(ForceRenderSystem);
app.createSystem(VelocityRenderSystem);
app.createSystem(ProfilerSystem);

app.run();
