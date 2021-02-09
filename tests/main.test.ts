import 'jest-extended';
import { setImmediate as flushMicroTasks } from 'timers';
import delayer, { MinimalDelayer } from '../src/index';

const nowDate = Date.now();

function flushPromises() {
	return new Promise(flushMicroTasks);
}

describe('Checking exported functions', () => {
	it('should provide delayer as new MinimalDelayer', () => {
		expect(delayer() instanceof MinimalDelayer).toBeTruthy();
	});
});

describe('timing tests', () => {
	beforeEach(() => {
		jest.setTimeout(300);
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should call functions and timeouts with proper arguments', async () => {
		const delay = 1000;

		const callback = jest.fn();

		const waiter = delayer(delay);

		expect(callback).not.toBeCalled();

		waiter.execute(callback);

		expect(callback).toBeCalled();
		expect(callback).toHaveBeenCalledTimes(1);

		expect(setTimeout).not.toBeCalled();

		jest.runAllTimers();
		await flushPromises();

		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), expect.toBeWithin(delay - 50, delay));
	});

	it('should delay more if executor takes longer than minimum delay', async () => {
		jest.useFakeTimers('modern');

		jest.setSystemTime(nowDate);

		const delay = 500;
		const executorTime = 2000;

		const executor = () => jest.setSystemTime(nowDate + executorTime);

		const waiter = delayer(delay);

		const promise = waiter.execute(executor);

		await flushPromises();
		jest.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(executorTime);
	});

	it('should delay using minimal if executor takes less than minimum delay', async () => {
		jest.useFakeTimers('modern');

		jest.setSystemTime(nowDate);

		const delay = 2000;
		const executorTime = 500;

		const executor = () => jest.setSystemTime(nowDate + executorTime);

		const waiter = delayer(delay);

		const promise = waiter.execute(executor);

		await flushPromises();
		jest.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(delay);
	});

	it('should delayed the same if the time and minimum delay are the same', async () => {
		jest.useFakeTimers('modern');

		jest.setSystemTime(nowDate);

		const delay = 1000;
		const executorTime = 1000;

		const executor = () => jest.setSystemTime(nowDate + executorTime);

		const waiter = delayer(delay);

		const promise = waiter.execute(executor);

		await flushPromises();
		jest.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(delay);
	});
});
