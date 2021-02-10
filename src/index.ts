export type ExecutedResults<T> = {
	/**
	 * The return value of the provided function.
	 */
	value?: T;
	/**
	 * The delay, in milliseconds, passed since creating the delayer and getting this result.
	 */
	delayPassed: number;
};

export class MinimumDelayer {
	public readonly minimumDelay: number;
	/**
	 * The target date on which this delayer will have finished.
	 *
	 * You can convert this value to a Date using `new Date(targetDate)`.
	 */
	public readonly targetDate: number;

	/**
	 * The creation date on which this delayer was created.
	 *
	 * You can convert this value to a Date using `new Date(creationDate)`.
	 */
	public readonly creationDate: number;

	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param minimumDelay The minimum delay, in milliseconds, before this delayer is considered complete.
	 */
	constructor(minimumDelay?: number) {
		this.minimumDelay = minimumDelay ?? 0;
		this.creationDate = Date.now();
		this.targetDate = this.creationDate + this.minimumDelay;
	}

	/**
	 * Execute a function immediately, upon which the results will be resolved after the minimum delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 *
	 * @param executor The function to execute immediately.
	 */
	async execute<T>(executor?: () => T | PromiseLike<T>): Promise<ExecutedResults<T>> {
		const results = await executor?.();

		const delayRemaining = this.targetDate - Date.now();

		return MinimumDelayer.delayFunction<ExecutedResults<T>>(
			() => ({
				value: results,
				delayPassed: Date.now() - this.creationDate,
			}),
			delayRemaining,
		);
	}

	/**
	 * @returns A promise, containing the time in milliseconds that took between this execution and the initial target date.
	 */
	async wait(): Promise<number> {
		const delayRemaining = this.targetDate - Date.now();

		return MinimumDelayer.delayFunction(() => delayRemaining, delayRemaining);
	}

	static async delayFunction<T>(executor: () => T, delayRemaining: number): Promise<T> {
		if (delayRemaining > 0) {
			return new Promise((resolve) => setTimeout(() => resolve(executor()), delayRemaining));
		} else {
			return executor();
		}
	}
}

/**
 * Creates a delayer that immediately execute the provided `executor` function and returns the value after a minimum of time defined by the `minimumDelay` parameter.
 *
 * @param executor The function to run immediately.
 * @param minimumDelay The minimum delay, in milliseconds, before this delayer is considered complete.
 */
export function delayer<T>(...args: MinimumDelayerArgsExecutor<T>): Promise<ExecutedResults<T>>;
/**
 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
 *
 * @param minimumDelay The minimum delay, in milliseconds, before this delayer is considered complete.
 */
export function delayer(...args: MinimumDelayerArgs): MinimumDelayer;

export function delayer<T>(...args: MinimumDelayerArgsExecutor<T> | MinimumDelayerArgs): MinimumDelayer | Promise<ExecutedResults<T>> {
	if (typeof args[0] == 'function') {
		const [executor, ...delayerArgs] = args;

		const delayer = new MinimumDelayer(...(delayerArgs as MinimumDelayerArgs));

		return delayer.execute(executor);
	} else {
		return new MinimumDelayer(...(args as MinimumDelayerArgs));
	}
}

type MinimumDelayerArgs = ConstructorParameters<typeof MinimumDelayer>;

type MinimumDelayerArgsExecutor<T> = [executor: () => T | PromiseLike<T>, ...args: MinimumDelayerArgs];

export default delayer;
