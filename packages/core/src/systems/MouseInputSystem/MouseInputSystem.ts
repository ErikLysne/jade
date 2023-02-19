import { PositionComponent, ShapeComponent } from '../../components';
import { ClickableComponent } from '../../components/ClickableComponent';
import { ComponentClass, Entity, System } from '../../engine';
import { Vector2 } from '../../math';

export class MouseInputSystem extends System {
	public requiredComponents = new Set<ComponentClass>([
		PositionComponent,
		ShapeComponent,
		ClickableComponent
	]);

	private mouseEventQueue: MouseEvent[] = [];

	onSystemCreated(): void {
		const canvasElement = this.app.getCanvas().getCanvasElement();

		canvasElement.addEventListener('click', (event) =>
			this.mouseEventQueue.push(event)
		);
	}

	update(entities: Entity[], duration?: number | undefined): void {
		const entitiesInClickPriorityOrder = entities
			.map((entity) => ({
				clickPriority: entity.getComponent(ClickableComponent).get()
					.clickPriority,
				entity
			}))
			.sort(
				(
					{ clickPriority: clickPriorityA },
					{ clickPriority: clickPriorityB }
				) => clickPriorityB - clickPriorityA
			)
			.map(({ entity }) => entity);

		const canvasElement = this.app.getCanvas().getCanvasElement();
		const boundingRect = canvasElement.getBoundingClientRect();

		for (const mouseEvent of this.mouseEventQueue) {
			let mousePosition = new Vector2(
				((mouseEvent.clientX - boundingRect.left) /
					boundingRect.width) *
					canvasElement.width,
				((mouseEvent.clientY - boundingRect.top) /
					boundingRect.height) *
					canvasElement.height
			);

			mousePosition = this.app
				.getCanvas()
				.canvasPositionToWorldPosition(mousePosition);

			for (const entity of entitiesInClickPriorityOrder) {
				const position = entity.getComponent(PositionComponent);
				const shape = entity.getComponent(ShapeComponent);
				const clickable = entity.getComponent(ClickableComponent);

				if (
					shape
						.get()
						.shape?.isWithin(mousePosition.subtract(position.get()))
				) {
					entity.onClick?.(mousePosition);

					if (!clickable.get().allowClickThrough) {
						break;
					}
				}
			}
		}

		this.mouseEventQueue = [];
	}
}
