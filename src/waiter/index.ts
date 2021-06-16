import { wait } from '$/utils';
import { CommonMinimumDelayer, CommonOptions, ExecutedResults } from '../common';

export interface WaiterOptions<T> extends Partial<CommonOptions<T>> {
	detailed?: false;
	fn: () => T | PromiseLike<T>;
}
export interface WaiterDetailedOptions<T> extends Partial<CommonOptions<T>> {
	detailed: true;
	fn: () => T | PromiseLike<T>;
}

export class Waiter<T> extends CommonMinimumDelayer<T> {
	/**
	 * Creates a waiter that prepares the function to be run after a minimum of delay specified.
	 *
	 * The main difference with the delayer function is that this doesn't execute the function immediately when it give it the function; it instead waits for the minimum delay, then executes it.
	 *
	 * @param options The options to give to this waiter.
	 */
	constructor(options?: WaiterOptions<T>) {
		super(options);
	}

	/**
	 * Execute the waiter function after the minimum delay finishes.
	 */
	async execute(): Promise<T> {
		return super.execute() as Promise<T>;
	}
}

export class WaiterDetailed<T> extends CommonMinimumDelayer<T> {
	/**
	 * Creates a waiter that prepares the function to be run after a minimum of delay specified.
	 *
	 * The main difference with the delayer function is that this doesn't execute the function immediately when it give it the function; it instead waits for the minimum delay, then executes it.
	 *
	 * @param options The options to give to this waiter.
	 */
	constructor(options?: WaiterDetailedOptions<T>) {
		super(options);
	}

	/**
	 * Execute the waiter function after the minimum delay finishes.
	 */
	async execute(): Promise<ExecutedResults<T>> {
		return super.execute() as Promise<ExecutedResults<T>>;
	}
}

/**
 * Creates a waiter that prepares function to be run after a minimum of delay specified.
 *
 * The main difference with the delayer function is that this doesn't execute the function immediately when it give it the function; it instead waits for the minimum delay, then executes it.
 *
 * @param options The options to give to this waiter.
 */
export function waiter<T>(options: WaiterOptions<T>): Waiter<T>;
/**
 * Creates a waiter that prepares function to be run after a minimum of delay specified.
 *
 * The main difference with the delayer function is that this doesn't execute the function immediately when it give it the function; it instead waits for the minimum delay, then executes it.
 *
 * @param options The options to give to this waiter.
 */
export function waiter<T>(options: WaiterDetailedOptions<T>): WaiterDetailed<T>;
/**
 * Creates a promise that resolves after the given delay.
 *
 * @param delay The delay in milliseconds.
 * @returns The initial given delay.
 */
export function waiter(delay: number): Promise<number>;

export function waiter<T>(options: number | WaiterOptions<T> | WaiterDetailedOptions<T>): Waiter<T> | WaiterDetailed<T> | Promise<number> {
	if (typeof options == 'number') {
		return wait(options);
	}
	if (!options.detailed) {
		return new Waiter(options as WaiterOptions<T>);
	} else {
		return new WaiterDetailed(options);
	}
}
