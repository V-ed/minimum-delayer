import { waiter } from '$/index';
import { setImmediate as flushMicroTasks } from 'timers';

const nowDate = Date.now();

function flushPromises() {
	return new Promise(flushMicroTasks);
}

describe('waiter timing tests', () => {
	beforeEach(() => {
		jest.setTimeout(300);
		jest.useFakeTimers('modern');
		jest.setSystemTime(nowDate);
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should call functions and timeouts with proper arguments', async () => {
		const delay = 1000;

		const callback = jest.fn();

		const minDelayer = waiter({ fn: callback, delay });

		expect(callback).not.toBeCalled();

		minDelayer.execute();

		expect(callback).not.toBeCalled();

		jest.setSystemTime(nowDate + delay);

		await flushPromises();
		jest.runAllTimers();

		expect(callback).toBeCalled();
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should wait more if time not reached', async () => {
		const delay = 500;
		const delayHalved = delay / 2;

		const callback = jest.fn();

		const minDelayer = waiter({ fn: callback, delay });

		jest.setSystemTime(nowDate + delayHalved);

		await flushPromises();
		jest.runAllTimers();

		minDelayer.execute();

		expect(callback).not.toBeCalled();

		jest.setSystemTime(nowDate + delayHalved);

		await flushPromises();
		jest.runAllTimers();

		expect(callback).toBeCalled();
	});

	it('should not wait more if time not reached', async () => {
		const delay = 500;

		const callback = jest.fn();

		const minDelayer = waiter({ fn: callback, delay });

		minDelayer.execute();

		jest.setSystemTime(nowDate + delay);

		await flushPromises();
		jest.runAllTimers();

		expect(callback).toBeCalled();
	});
});
