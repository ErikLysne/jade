export class EventManager<TEventData extends Record<string, any>> {
	private eventListeners: {
		[event in keyof TEventData]?: ((value: TEventData[event]) => void)[];
	} = {};

	addListener<TEvent extends keyof TEventData>(
		event: TEvent,
		callback: (value: TEventData[TEvent]) => void
	): this {
		if (this.eventListeners[event]) {
			this.eventListeners[event]!.push(callback);
		} else {
			this.eventListeners[event] = [callback];
		}
		return this;
	}

	removeListener<TEvent extends keyof TEventData>(
		event: TEvent,
		callback: (value: TEventData[TEvent]) => void
	): this {
		const eventListenerCallback = this.eventListeners[event]?.find(
			(eventListenersCallback) => eventListenersCallback === callback
		);

		if (eventListenerCallback) {
			this.eventListeners[event]!.splice(
				this.eventListeners[event]!.indexOf(eventListenerCallback),
				1
			);

			if (this.eventListeners[event]!.length === 0) {
				delete this.eventListeners[event];
			}
		}

		return this;
	}

	clear(): this {
		this.eventListeners = {};
		return this;
	}

	getEventListeners<TEvent extends keyof TEventData>(event: TEvent) {
		return this.eventListeners[event];
	}

	dispatch<TEvent extends keyof TEventData>(
		event: TEvent,
		data: TEventData[TEvent]
	): this {
		this.eventListeners[event]?.forEach((callback) => callback(data));
		return this;
	}
}
