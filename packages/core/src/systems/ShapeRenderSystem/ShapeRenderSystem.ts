import { PositionComponent, ShapeComponent } from '../../components';
import { Entity, RenderSystem } from '../../engine';

export class ShapeRenderSystem extends RenderSystem {
	public requiredComponents = new Set([PositionComponent, ShapeComponent]);

	update(entities: Entity[]): void {
		for (const entity of entities) {
			const position = entity.getComponent(PositionComponent);
			const renderableShape = entity.getComponent(ShapeComponent);
			const { shape, renderPriority } = renderableShape.get();

			this.app.queueRendering((canvas) => {
				shape?.render(
					canvas,
					canvas.worldPositionToCanvasPosition(position.get())
				);
			}, renderPriority);
		}
	}
}
