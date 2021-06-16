import { delayer, MinimumDelayer, MinimumDelayerDetailed, Waiter, waiter, WaiterDetailed } from '$/index';
import { setImmediate as flushMicroTasks } from 'timers';

const nowDate = Date.now();

function flushPromises() {
	return new Promise(flushMicroTasks);
}

describe('Checking exported functions', () => {
	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	describe('delayer', () => {
		it('should provide delayer as new MinimumDelayer', () => {
			expect(delayer(200) instanceof MinimumDelayer).toBeTruthy();
		});

		it('should provide delayer as new MinimumDelayerDetailed', () => {
			expect(delayer(200, { detailed: true }) instanceof MinimumDelayerDetailed).toBeTruthy();
		});

		it('should provide delayer as new Promise', async () => {
			jest.useFakeTimers('modern');
			jest.setSystemTime(nowDate);

			const delay = 500;

			const minDelayer = delayer(() => 2, { delay: delay });

			expect(minDelayer instanceof Promise).toBeTruthy();

			await flushPromises();
			jest.runAllTimers();

			const results = await minDelayer;

			expect(results).toBe(2);
		});

		it('should provide delayer as new Detailed Promise', async () => {
			jest.useFakeTimers('modern');
			jest.setSystemTime(nowDate);

			const delay = 500;

			const minDelayer = delayer(() => 2, { delay, detailed: true });

			expect(minDelayer instanceof Promise).toBeTruthy();

			await flushPromises();
			jest.runAllTimers();

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
