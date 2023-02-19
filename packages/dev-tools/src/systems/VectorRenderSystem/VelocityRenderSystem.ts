import {
	Entity,
	PositionComponent,
	ShapeRenderOptions,
	VelocityComponent
} from '@jade/core';
import { VectorRenderSystem } from './VectorRenderSystem';

export class VelocityRenderSystem extends VectorRenderSystem {
	requiredComponents = new Set([PositionComponent, VelocityComponent]);

	protected arrowOptions: ShapeRenderOptions = {
		strokeStyle: '#91C7B1',
		lineWidth: 3
	};

	update(entities: Entity[]): void {
		for (const entity of entities) {
			const position = entity.getComponent(PositionComponent);
			const velocity = entity.getComponent(VelocityComponent);

			this.app.queueRendering((canvas) => {
				this.renderVector(canvas, position.get(), velocity.get(), 'v');
			}, 1000);
		}
	}
}
