import { Component } from '../engine';

export class DampingComponent extends Component {
	private damping = 1;

	set(damping: number): this {
		this.damping = damping;
		return this;
	}

	get(): number {
		return this.damping;
	}
}
