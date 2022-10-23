import { PositionComponent, ShapeComponent } from '../../components';
import { ComponentClass, Entity, RenderSystem } from '../../engine';

export class ShapeRenderSystem extends RenderSystem {
	public requiredComponents: Set<ComponentClass> = new Set([
		PositionComponent,
		ShapeComponent
	]);

	update(entities: Entity[]): void {
		for (const entity of entities) {
			const position = entity.getComponent(PositionComponent);
			const renderableShape = entity.getComponent(ShapeComponent);
			const { shape, priority } = renderableShape.get();

			this.app.queueRendering((canvas) => {
				shape?.render(
					canvas,
					canvas.worldPositionToCanvasPosition(position.get())
				);
			}, priority);
		}
	}
}
