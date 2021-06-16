import { CommonMinimumDelayer, CommonOptions, ExecutedResults } from '../common';

export interface WaiterOptions<T> extends Partial<CommonOptions> {
	detailed?: false;
	/** Function to run eventually. */
	fn: () => T | PromiseLike<T>;
}
export interface WaiterDetailedOptions<T> extends Partial<CommonOptions> {
	detailed?: true;
	/** Function to run eventually. */
	fn: () => T | PromiseLike<T>;
}

export class Waiter<T> extends CommonMinimumDelayer {
	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param options The options to give to this delayer.
	 */
	constructor(options?: Partial<WaiterOptions<T>>) {
		super(options);
	}

	/**
	 * Execute the waiter function, upon which the results will be resolved after the minimum delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 */
	async execute(): Promise<T> {
		return super.execute() as Promise<T>;
	}
}

export class WaiterDetailed<T> extends CommonMinimumDelayer {
	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param options The options to give to this delayer.
	 */
	constructor(options?: Partial<WaiterDetailedOptions<T>>) {
		super(options);
	}

	/**
	 * Execute the waiter function, upon which the results will be resolved after the minimum delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 */
	async execute(): Promise<ExecutedResults<T>> {
		return super.execute() as Promise<ExecutedResults<T>>;
	}
}

/**
 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
 *
 * Equivalent to doing `delayer({minimumDelay: number})`
 *
 * @param delay The delay in milliseconds.
 */
export function waiter<T>(options: WaiterOptions<T>): Waiter<T>;
/**
 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
 *
 * Equivalent to doing `delayer({minimumDelay: number})`
 *
 * @param delay The delay in milliseconds.
 */
export function waiter<T>(options: WaiterDetailedOptions<T>): WaiterDetailed<T>;

export function waiter<T>(options: WaiterOptions<T> | WaiterDetailedOptions<T>): Waiter<T> | WaiterDetailed<T> {
	if (!options.detailed) {
		return new Waiter({ ...options, detailed: false });
	} else {
		return new WaiterDetailed(options);
	}
}
