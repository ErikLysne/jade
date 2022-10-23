import { describeClass } from '../../test/describeClass';
import { EventManager } from '../EventManager';

const describeEventManager = describeClass(EventManager);

interface UpdateEvent {
	updateStarted: {
		timestamp: number;
	};
	updateFinished: {
		timestamp: number;
		duration: number;
	};
}

const eventManager = new EventManager<UpdateEvent>();

beforeEach(() => {
	eventManager.clear();
});

describeEventManager('function: addListener', () => {
	it('adds the event listener', () => {
		const callback = () => {};
		eventManager.addListener('updateStarted', callback);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback)
		).toBe(true);
	});

	it('adds multiple event listeners to the same event type', () => {
		const callback1 = () => {};
		const callback2 = () => {};
		eventManager.addListener('updateStarted', callback1);
		eventManager.addListener('updateStarted', callback2);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback1)
		).toBe(true);
		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback2)
		).toBe(true);
	});

	it('adds event listeners to multiple events types', () => {
		const callback1 = () => {};
		const callback2 = () => {};
		eventManager.addListener('updateStarted', callback1);
		eventManager.addListener('updateFinished', callback2);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback1)
		).toBe(true);
		expect(
			eventManager
				.getEventListeners('updateFinished')
				?.includes(callback2)
		).toBe(true);
	});
});

describeEventManager('function: removeListener', () => {
	it('removes the event listener', () => {
		const callback = () => {};
		eventManager.addListener('updateStarted', callback);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback)
		).toBe(true);

		eventManager.removeListener('updateStarted', callback);

		expect(
			eventManager.getEventListeners('updateStarted')
		).not.toBeDefined();
	});

	it('removes the event listener with multiple event listeners on the same event type', () => {
		const callback1 = () => {};
		const callback2 = () => {};
		eventManager.addListener('updateStarted', callback1);
		eventManager.addListener('updateStarted', callback2);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback1)
		).toBe(true);
		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback2)
		).toBe(true);

		eventManager.removeListener('updateStarted', callback2);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback1)
		).toBe(true);
		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback2)
		).toBe(false);
	});

	it('removes the event listener with event listeners on multiple event types', () => {
		const callback1 = () => {};
		const callback2 = () => {};
		eventManager.addListener('updateStarted', callback1);
		eventManager.addListener('updateFinished', callback2);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback1)
		).toBe(true);
		expect(
			eventManager
				.getEventListeners('updateFinished')
				?.includes(callback2)
		).toBe(true);

		eventManager.removeListener('updateFinished', callback2);

		expect(
			eventManager.getEventListeners('updateStarted')?.includes(callback1)
		).toBe(true);
		expect(
			eventManager.getEventListeners('updateFinished')
		).not.toBeDefined();
	});
});
