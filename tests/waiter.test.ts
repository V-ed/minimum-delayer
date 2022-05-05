import { waiter } from '$/index';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, nowDate } from './helper';

describe('waiter timing tests', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(nowDate);
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should call functions and timeouts with proper arguments', async () => {
		const delay = 1000;

		const callback = vi.fn();

		const minDelayer = waiter({ fn: callback, delay });

		expect(callback).not.toBeCalled();

		minDelayer.execute();
		await flushPromises();

		expect(callback).not.toBeCalled();

		vi.advanceTimersByTime(delay);

		expect(callback).toBeCalled();
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should wait more if time not reached', async () => {
		const delay = 500;
		const delayHalved = delay / 2;

		const callback = vi.fn();

		const minDelayer = waiter({ fn: callback, delay });

		minDelayer.execute();
		await flushPromises();

		vi.advanceTimersByTime(delayHalved);

		expect(callback).not.toBeCalled();

		vi.advanceTimersByTime(delayHalved);

		expect(callback).toBeCalled();
	});
});
