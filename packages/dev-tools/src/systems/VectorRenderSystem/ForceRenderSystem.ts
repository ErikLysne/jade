import {
	Entity,
	ForceRegistryComponent,
	PositionComponent,
	ShapeRenderOptions
} from '@jade/core';
import { VectorRenderSystem } from './VectorRenderSystem';

export class ForceRenderSystem extends VectorRenderSystem {
	requiredComponents = new Set([PositionComponent, ForceRegistryComponent]);

	protected arrowOptions: ShapeRenderOptions = {
		strokeStyle: '#B33951',
		lineWidth: 3
	};

	update(entities: Entity[]): void {
		for (const entity of entities) {
			const position = entity.getComponent(PositionComponent);
			const forceRegistry = entity.getComponent(ForceRegistryComponent);

			for (const generatedForce of forceRegistry.getGeneratedForces()) {
				this.app.queueRendering((canvas) => {
					this.renderVector(
						canvas,
						position.get(),
						generatedForce[1],
						generatedForce[0]
					);
				}, 1000);
			}
		}
	}
}
