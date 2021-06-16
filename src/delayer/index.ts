import { CommonMinimumDelayer, CommonOptions, ExecutedResults } from '../common';
import type {
	DelayerArgsExecutor,
	DelayerDetailedArgsExecutor,
	DelayerDetailedImmediateArgs,
	DelayerImmediateArgs,
	MinimumDelayerArgs,
} from './types';

export interface MinimumDelayerOptions extends CommonOptions {
	detailed: false;
}
export interface MinimumDelayerDetailedOptions extends CommonOptions {
	detailed: true;
}

export class MinimumDelayer extends CommonMinimumDelayer {
	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param options The options to give to this delayer.
	 */
	constructor(options?: Partial<MinimumDelayerOptions>) {
		super(options);
	}

	/**
	 * Execute a function immediately, upon which the results will be resolved after the minimum delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 *
	 * @param executor The function to execute immediately.
	 */
	async execute<T>(executor: () => T | PromiseLike<T>): Promise<T> {
		return super.execute(executor) as Promise<T>;
	}
}

export class MinimumDelayerDetailed extends CommonMinimumDelayer {
	/**
	 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
	 *
	 * @param options The options to give to this delayer.
	 */
	constructor(options?: Partial<MinimumDelayerDetailedOptions>) {
		super(options);
	}

	/**
	 * Execute a function immediately, upon which the results will be resolved after the minimum delay finishes.
	 * If this function takes more time to finish than the initial delay given, the delayer will not wait any longer.
	 *
	 * @param executor The function to execute immediately.
	 */
	async execute<T>(executor: () => T | PromiseLike<T>): Promise<ExecutedResults<T>> {
		return super.execute(executor) as Promise<ExecutedResults<T>>;
	}
}

/**
 * Creates a delayer that immediately execute the provided `executor` function and returns the value after a minimum of time defined by the `minimumDelay` option.
 *
 * @param executor The function to run immediately.
 * @param options The options to give to this delayer.
 */
export function delayer<T>(...args: DelayerArgsExecutor<T>): Promise<T>;
/**
 * Creates a delayer that immediately execute the provided `executor` function and returns the value after a minimum of time defined by the `minimumDelay` option.
 *
 * @param executor The function to run immediately.
 * @param options The options to give to this delayer.
 */
export function delayer<T>(...args: DelayerDetailedArgsExecutor<T>): Promise<ExecutedResults<T>>;
/**
 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
 *
 * Equivalent to doing `delayer({minimumDelay: number})`
 *
 * @param delay The delay in milliseconds.
 */
export function delayer(...args: DelayerImmediateArgs): MinimumDelayer;
/**
 * Creates a delayer that can execute function and return a promise only when the minimum delay has been reached.
 *
 * Equivalent to doing `delayer({minimumDelay: number})`
 *
 * @param delay The delay in milliseconds.
 */
export function delayer(...args: DelayerDetailedImmediateArgs): MinimumDelayerDetailed;

export function delayer<T>(
	...args: DelayerArgsExecutor<T> | DelayerDetailedArgsExecutor<T> | DelayerImmediateArgs | DelayerDetailedImmediateArgs
): MinimumDelayer | MinimumDelayerDetailed | Promise<T> | Promise<ExecutedResults<T>> {
	if (typeof args[0] == 'function') {
		const [executor, options] = args;

		let chosenDelayer;

		if (!options?.detailed) {
			chosenDelayer = new MinimumDelayer(options as Partial<MinimumDelayerOptions> | undefined);
		} else {
			chosenDelayer = new MinimumDelayerDetailed(options);
		}

		return chosenDelayer.execute(executor);
	} else if (typeof args[0] == 'number') {
		const [delay, options] = args;

		if (!options?.detailed) {
			return new MinimumDelayer({ minimumDelay: delay, ...((options as Partial<MinimumDelayerOptions> | undefined) ?? []) });
		} else {
			return new MinimumDelayerDetailed({ minimumDelay: delay, ...options });
		}
	} else {
		return new MinimumDelayer(...(args as MinimumDelayerArgs));
	}
}
