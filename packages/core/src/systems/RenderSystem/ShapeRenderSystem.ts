import { PositionComponent, ShapeComponent } from '../../components';
import { Entity, System } from '../../ecs';
import { Canvas } from '../../graphics';

export class ShapeRenderSystem extends System {
	#canvas?: Canvas;

	requiredComponents = new Set([PositionComponent, ShapeComponent]);

	setCanvas(canvas: Canvas): ShapeRenderSystem {
		this.#canvas = canvas;
		return this;
	}

	getCanvas(): Canvas | undefined {
		return this.#canvas;
	}

	update(entities: Entity[], duration?: number | undefined): void {
		if (!this.#canvas) {
			return;
		}

		this.#canvas.clear().renderBackground();

		entities.forEach((entity) => {
			const position = entity.getComponent(PositionComponent)!;
			const renderableShape = entity.getComponent(ShapeComponent)!;

			renderableShape
				.get()
				?.render(
					this.#canvas!,
					this.#canvas!.worldPositionToCanvasPosition(position.get())
				);
		});
	}
}
