export async function delayFunction<T>(executor: () => T, delayRemaining: number): Promise<T> {
	if (delayRemaining > 0) {
		return new Promise((resolve) => setTimeout(() => resolve(executor()), delayRemaining));
	} else {
		return executor();
	}
}

/**
 * @returns A promise, containing the time in milliseconds that took between this execution and the initial target date.
 */
export async function wait(delay: number): Promise<number> {
	return delayFunction(() => delay, delay);
}
