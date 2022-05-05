import { delayer } from '$/index';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from './helper';

describe('delayer timing tests', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should call functions and timeouts with proper arguments', async () => {
		const delay = 1000;

		const callback = vi.fn();

		const minDelayer = delayer(delay);

		expect(callback).not.toBeCalled();

		const date = Date.now();

		minDelayer.execute(callback);

		await flushPromises();

		expect(callback).toBeCalled();
		expect(callback).toHaveBeenCalledTimes(1);

		// callback ran immediately
		expect(Date.now() - date).toBe(0);

		vi.runAllTimers();

		// callback value is returned after delay has passed
		expect(Date.now() - date).toBe(delay);
	});

	it('should delay more if executor takes longer than minimum delay', async () => {
		const delay = 500;
		const executorTime = 2000;

		const executor = () => vi.advanceTimersByTime(executorTime);

		const minDelayer = delayer(delay, { detailed: true });

		const promise = minDelayer.execute(executor);

		await flushPromises();
		vi.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(executorTime);
	});

	it('should delay using minimum if executor takes less than minimum delay', async () => {
		const delay = 2000;
		const executorTime = 500;

		const executor = () => vi.advanceTimersByTime(executorTime);

		const minDelayer = delayer(delay, { detailed: true });

		const promise = minDelayer.execute(executor);

		await flushPromises();
		vi.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(delay);
	});

	it('should delayed the same if the time and minimum delay are the same', async () => {
		const delay = 1000;

		const executor = () => vi.advanceTimersByTime(delay);

		const minDelayer = delayer(delay, { detailed: true });

		const promise = minDelayer.execute(executor);

		await flushPromises();
		vi.runAllTimers();

		const results = await promise;

		expect(results.delayPassed).toBe(delay);
	});
});
