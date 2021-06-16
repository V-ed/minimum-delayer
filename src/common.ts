import { delayFunction } from './utils';

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

export interface CommonOptions<T = unknown> {
	/** The minimum delay, in milliseconds, before this delayer is considered complete. */
	delay: number;
	/** Determines if the promise's result should be the return value of the executor or a detailed object containing the data and extra statistics. */
	detailed?: boolean;
	/** Function to run eventually. */
	fn?: () => T | PromiseLike<T>;
}

export class CommonMinimumDelayer<T = unknown> {
	public get minimumDelay() {
		return this.options.delay;
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

	protected options: CommonOptions<T>;

	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param options The options to give to this delayer.
	 */
	constructor(options?: Partial<CommonOptions<T>>) {
		this.options = {
			...{
				delay: 0,
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
	async execute(executor?: () => T | PromiseLike<T>): Promise<T | undefined | ExecutedResults<T | undefined>> {
		let results = await executor?.();

		const delayRemaining = this.targetDate - Date.now();

		return delayFunction(async () => {
			if (this.options.fn) {
				results = await this.options.fn();
			}

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
}
