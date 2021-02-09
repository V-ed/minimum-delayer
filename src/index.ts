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

export class MinimalDelayer {
	public readonly minimalDelay: number;
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
	 * Creates a delayer that can execute function and return a promise only when the minimal delay has been reached.
	 *
	 * @param minimalDelay The minimal delay, in milliseconds, before this delayer is considered complete.
	 */
	constructor(minimalDelay?: number) {
		this.minimalDelay = minimalDelay ?? 0;
		this.creationDate = Date.now();
		this.targetDate = this.creationDate + this.minimalDelay;
	}

	/**
	 * Execute a function immediately, upon which the results will be resolved after the minimal delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 *
	 * @param executor The function to execute immediately.
	 */
	async execute<T>(executor?: () => T | PromiseLike<T>): Promise<ExecutedResults<T>> {
		const results = await executor?.();

		const delayRemaining = this.targetDate - Date.now();

		return MinimalDelayer.delayFunction<ExecutedResults<T>>(
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

		return MinimalDelayer.delayFunction(() => delayRemaining, delayRemaining);
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
 * Creates a delayer that can execute function and return a promise only when the minimal delay has been reached.
 *
 * @param minimalDelay The minimal delay, in milliseconds, before this delayer is considered complete.
 */
export const delayer = (...args: ConstructorParameters<typeof MinimalDelayer>): MinimalDelayer => new MinimalDelayer(...args);

export default delayer;
