type ClassMethods<T> = {
	[P in keyof T]-?: T[P] extends Function ? P : never;
}[keyof T];

export const describeClass = <
	TClass extends abstract new (...args: any) => any
>(
	C: TClass
) => {
	return (
		name: `function: ${Extract<
			| ClassMethods<InstanceType<typeof C>>
			| Exclude<keyof typeof C, 'prototype'>,
			string
		>}`,
		fn: () => void
	) => describe(name, fn);
};
