export type ExecutedResults<T> = {
	/**
	 * The return value of the provided function.
	 */
	value: T;
	/**
	 * The delay, in milliseconds, passed since creating the delayer and getting this result.
	 */
	delayPassed: number;
};

export interface CommonOptions {
	/** The minimum delay, in milliseconds, before this delayer is considered complete. */
	minimumDelay: number;
	/** Determines if the promise's result should be the return value of the executor or a detailed object containing the data and extra statistics. */
	detailed?: boolean;
}

export class CommonMinimumDelayer {
	public get minimumDelay() {
		return this.options.minimumDelay;
	}
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

	protected options: CommonOptions;

	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param options The options to give to this delayer.
	 */
	constructor(options?: Partial<CommonOptions>) {
		this.options = {
			...{
				minimumDelay: 0,
				detailed: false,
			},
			...options,
		};

		this.creationDate = Date.now();
		this.targetDate = this.creationDate + this.minimumDelay;
	}

	/**
	 * Execute a function immediately, upon which the results will be resolved after the minimum delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 *
	 * @param executor The function to execute immediately.
	 */
	async execute(executor?: () => unknown | PromiseLike<unknown>): Promise<unknown | undefined | ExecutedResults<unknown>> {
		const results = await executor?.();

		const delayRemaining = this.targetDate - Date.now();

		return CommonMinimumDelayer.delayFunction(() => {
			if (this.options.detailed) {
				return {
					value: results,
					delayPassed: Date.now() - this.creationDate,
				};
			} else {
				return results;
			}
		}, delayRemaining);
	}

	/**
	 * @returns A promise, containing the time in milliseconds that took between this execution and the initial target date.
	 */
	async wait(): Promise<number> {
		const delayRemaining = this.targetDate - Date.now();

		return CommonMinimumDelayer.delayFunction(() => delayRemaining, delayRemaining);
	}

	static async delayFunction<T>(executor: () => T, delayRemaining: number): Promise<T> {
		if (delayRemaining > 0) {
			return new Promise((resolve) => setTimeout(() => resolve(executor()), delayRemaining));
		} else {
			return executor();
		}
	}
}
