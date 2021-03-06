import { delayer } from '$/index';
import { setImmediate as flushMicroTasks } from 'timers';

const nowDate = Date.now();

function flushPromises() {
	return new Promise(flushMicroTasks);
}

describe('delayer timing tests', () => {
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

		jest.spyOn(window, 'setTimeout');

		const minDelayer = delayer(delay);

		expect(callback).not.toBeCalled();

		minDelayer.execute(callback);

		expect(callback).toBeCalled();
		expect(callback).toHaveBeenCalledTimes(1);

		expect(setTimeout).not.toBeCalled();

		await flushPromises();
		jest.runAllTimers();

		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
	});

	it('should delay more if executor takes longer than minimum delay', async () => {
		const delay = 500;
		const executorTime = 2000;

		const executor = () => jest.setSystemTime(nowDate + executorTime);

		const minDelayer = delayer(delay, { detailed: true });

		const promise = minDelayer.execute(executor);

		await flushPromises();
		jest.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(executorTime);
	});

	it('should delay using minimum if executor takes less than minimum delay', async () => {
		const delay = 2000;
		const executorTime = 500;

		const executor = () => jest.setSystemTime(nowDate + executorTime);

		const minDelayer = delayer(delay, { detailed: true });

		const promise = minDelayer.execute(executor);

		await flushPromises();
		jest.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(delay);
	});

	it('should delayed the same if the time and minimum delay are the same', async () => {
		const delay = 1000;

		const executor = () => jest.setSystemTime(nowDate + delay);

		const minDelayer = delayer(delay, { detailed: true });

		const promise = minDelayer.execute(executor);

		await flushPromises();
		jest.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(delay);
	});
});
