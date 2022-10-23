export abstract class Component {
	abstract get(): any;
	abstract set(...args: any[]): any;
}

export type ComponentClass<TComponent extends Component = Component> = new (
	...args: any[]
) => TComponent;
