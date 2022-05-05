import { delayer, MinimumDelayer, MinimumDelayerDetailed, Waiter, waiter, WaiterDetailed } from '$/index';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, nowDate } from './helper';

describe('Checking exported functions', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(nowDate);
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('delayer', () => {
		it('should provide delayer as new MinimumDelayer', () => {
			expect(delayer(200) instanceof MinimumDelayer).toBeTruthy();
		});

		it('should provide delayer as new MinimumDelayerDetailed', () => {
			expect(delayer(200, { detailed: true }) instanceof MinimumDelayerDetailed).toBeTruthy();
		});

		it('should provide delayer as new Promise', async () => {
			// vi.useFakeTimers('modern');
			vi.useFakeTimers();
			vi.setSystemTime(nowDate);

			const delay = 500;

			const minDelayer = delayer(() => 2, { delay: delay });

			expect(minDelayer instanceof Promise).toBeTruthy();

			await flushPromises();
			vi.runAllTimers();

			const results = await minDelayer;

			expect(results).toBe(2);
		});

		it('should provide delayer as new Detailed Promise', async () => {
			// vi.useFakeTimers('modern');
			vi.useFakeTimers();
			vi.setSystemTime(nowDate);

			const delay = 500;

			const minDelayer = delayer(() => 2, { delay, detailed: true });

			expect(minDelayer instanceof Promise).toBeTruthy();

			await flushPromises();
			vi.runAllTimers();

			const results = await minDelayer;

			expect(results).toBeDefined();
			expect(results.value).toBeDefined();
			expect(results.value).toBe(2);
		});
	});
	describe('waiter', () => {
		it('should provide waiter as new Waiter', () => {
			expect(
				waiter({
					fn: () => 2,
				}) instanceof Waiter,
			).toBeTruthy();
		});

		it('should provide delayer as new MinimumDelayerDetailed', () => {
			expect(waiter({ fn: () => 2, detailed: true }) instanceof WaiterDetailed).toBeTruthy();
		});
	});
});
