import { Component } from '../ecs';

export class DampingComponent extends Component {
	#damping = 1;

	set(damping: number): DampingComponent {
		this.#damping = damping;
		return this;
	}

	get(): number {
		return this.#damping;
	}
}
