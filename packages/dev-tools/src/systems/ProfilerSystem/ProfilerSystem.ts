import { ComponentClass, Entity, RenderSystem } from '@jade/core';

interface ProfilerSystemTextOptions {
	margin: number;
	textColor: string;
}

interface ProfilerSystemValues {
	min: number;
	max: number;
	average: number;
}

type ProfilerSystemMetrics = 'elapsedTime' | 'remainingTime';

export class ProfilerSystem extends RenderSystem {
	requiredComponents: Set<ComponentClass> = new Set([]);

	private metricsNumIterations = 1000;
	readonly updateSystemsPhaseMetrics: Record<
		ProfilerSystemMetrics,
		number[]
	> = {
		elapsedTime: [],
		remainingTime: []
	};
	private readonly updateRenderSystemsPhaseMetrics: Record<
		ProfilerSystemMetrics,
		number[]
	> = {
		elapsedTime: [],
		remainingTime: []
	};
	private readonly updateSystemsMetrics: Map<
		string,
		Record<ProfilerSystemMetrics, number[]>
	> = new Map();

	private textOptions: ProfilerSystemTextOptions = {
		margin: 12,
		textColor: '#F1F7ED'
	};

	setMetricNumberOfIterations(iterations: number): this {
		this.metricsNumIterations = iterations;
		return this;
	}

	getMetricNumberOfIterations(): number {
		return this.metricsNumIterations;
	}

	setTextOptions(options: Partial<ProfilerSystemTextOptions>): this {
		this.textOptions = { ...this.textOptions, ...options };
		return this;
	}

	getTextOptions(): ProfilerSystemTextOptions {
		return this.textOptions;
	}

	private getTextLocation(placement: 'left' | 'right'): {
		x: number;
		y: number;
	} {
		if (placement === 'left') {
			return {
				x: this.textOptions.margin,
				y: this.textOptions.margin
			};
		} else {
			return {
				x: this.canvas.getWidth() - this.textOptions.margin,
				y: this.textOptions.margin
			};
		}
	}

	private calculateSystemMetrics(values: number[]): ProfilerSystemValues {
		return {
			min: Math.min(...values),
			max: Math.max(...values),
			average:
				values.reduce((acc, value) => {
					acc += value;
					return acc;
				}, 0) / values.length
		};
	}

	onSystemCreated(): void {
		this.app.eventManager.updateSystemsPhase.addListener(
			'finished',
			({ elapsedTime, remainingTime }) => {
				this.updateSystemsPhaseMetrics.elapsedTime.push(elapsedTime);
				this.updateSystemsPhaseMetrics.remainingTime.push(
					remainingTime
				);

				if (
					this.updateSystemsPhaseMetrics.elapsedTime.length >
					this.metricsNumIterations
				) {
					this.updateSystemsPhaseMetrics.elapsedTime.shift();
				}
				if (
					this.updateSystemsPhaseMetrics.remainingTime.length >
					this.metricsNumIterations
				) {
					this.updateSystemsPhaseMetrics.remainingTime.shift();
				}
			}
		);
		this.app.eventManager.updateRenderSystemsPhase.addListener(
			'finished',
			({ elapsedTime }) => {
				this.updateRenderSystemsPhaseMetrics.elapsedTime.push(
					elapsedTime
				);

				if (
					this.updateRenderSystemsPhaseMetrics.elapsedTime.length >
					this.metricsNumIterations
				) {
					this.updateRenderSystemsPhaseMetrics.elapsedTime.shift();
				}
			}
		);
		this.app.eventManager.updateSystem.addListener(
			'finished',
			({ name, elapsedTime }) => {
				const systemMetrics = this.updateSystemsMetrics.get(name);

				if (!systemMetrics) {
					this.updateSystemsMetrics.set(name, {
						elapsedTime: [elapsedTime],
						remainingTime: []
					});
					return;
				}

				systemMetrics.elapsedTime.push(elapsedTime);

				if (
					systemMetrics.elapsedTime.length > this.metricsNumIterations
				) {
					systemMetrics.elapsedTime.shift();
				}
			}
		);
	}

	update(entities: Entity[]): void {
		const updateSystemPhaseElapsedTime = this.calculateSystemMetrics(
			this.updateSystemsPhaseMetrics.elapsedTime
		);
		const updateSystemPhaseRemainingTime = this.calculateSystemMetrics(
			this.updateSystemsPhaseMetrics.remainingTime
		);
		const updateRenderSystemPhaseElapsedTime = this.calculateSystemMetrics(
			this.updateRenderSystemsPhaseMetrics.elapsedTime
		);

		const updateSystemMetrics = [
			...this.updateSystemsMetrics.entries()
		].map(([name, metrics]) => ({
			name,
			metrics: this.calculateSystemMetrics(metrics.elapsedTime)
		}));

		const averageSystemBudgetUsed =
			updateSystemPhaseElapsedTime.average /
			(updateSystemPhaseElapsedTime.average +
				updateSystemPhaseRemainingTime.average);

		const headerText = 'System profiler';
		const sampleSizeText = `Metrics from last ${this.metricsNumIterations} iterations`;
		const systepUpdatePhaseText = `Avg system budget used: ${(
			100 * averageSystemBudgetUsed
		).toFixed(
			2
		)}%\n\nSystems:\nElapsed:\n  min: ${updateSystemPhaseElapsedTime.min.toFixed(
			1
		)} ms\n  max: ${updateSystemPhaseElapsedTime.max.toFixed(
			1
		)} ms\n  avg: ${updateSystemPhaseElapsedTime.max.toFixed(
			1
		)} ms\n\nRemaining:\n  min: ${updateSystemPhaseRemainingTime.min.toFixed(
			1
		)} ms\n  max: ${updateSystemPhaseRemainingTime.max.toFixed(
			1
		)} ms\n  avg: ${updateSystemPhaseRemainingTime.max.toFixed(
			1
		)} ms\n\nRender systems:\nElapsed:\n  min: ${updateRenderSystemPhaseElapsedTime.min.toFixed(
			1
		)} ms\n  max: ${updateRenderSystemPhaseElapsedTime.max.toFixed(
			1
		)} ms\n  avg: ${updateRenderSystemPhaseElapsedTime.max.toFixed(1)} ms`;

		const systemsUpdateText = updateSystemMetrics.reduce(
			(acc, { name, metrics }) => {
				acc += `${name}:\n  min: ${metrics.min.toFixed(
					1
				)} ms\n  max: ${metrics.max.toFixed(
					1
				)} ms\n  avg: ${metrics.max.toFixed(1)} ms\n
              \n
            `;

				return acc;
			},
			''
		);

		const availableHeight = this.canvas.getHeight();

		const lineHeight = availableHeight / 40;

		this.app.queueRendering((canvas) => {
			const ctx = canvas.getCtx();
			ctx.save();

			ctx.fillStyle = this.textOptions.textColor;

			let textLocation = this.getTextLocation('left');
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';

			ctx.font = `bold ${1.5 * lineHeight}px arial`;
			ctx.fillText(headerText, textLocation.x, textLocation.y);
			ctx.font = `bold ${0.75 * lineHeight}px arial`;
			ctx.fillText(
				sampleSizeText,
				textLocation.x,
				textLocation.y + 1.5 * lineHeight
			);

			ctx.font = `${lineHeight}px arial`;

			let index = 0;
			for (const line of systepUpdatePhaseText.split('\n')) {
				ctx.fillText(
					line,
					textLocation.x,
					textLocation.y + (2.5 + 1.1 * index) * lineHeight
				);
				index++;
			}

			textLocation = this.getTextLocation('right');
			ctx.textBaseline = 'top';
			index = 0;
			const maxWordLength = Math.max(
				...systemsUpdateText
					.split('\n')
					.map((line) => ctx.measureText(line).width)
			);
			for (const line of systemsUpdateText.split('\n')) {
				ctx.fillText(
					line,
					textLocation.x - maxWordLength,
					textLocation.y + 1.1 * index * lineHeight
				);
				index++;
			}
			ctx.restore();
		}, 1000);
	}
}
