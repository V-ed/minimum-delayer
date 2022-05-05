import { setImmediate as flushMicroTasks } from 'timers';

export const nowDate = Date.now();

export function flushPromises() {
	return new Promise(flushMicroTasks);
}
