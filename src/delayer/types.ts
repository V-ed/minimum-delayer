import type { MinimumDelayer, MinimumDelayerDetailed } from '..';

export type MinimumDelayerArgs = ConstructorParameters<typeof MinimumDelayer>;
export type MinimumDelayerDetailedArgs = ConstructorParameters<typeof MinimumDelayerDetailed>;

export type DelayerArgsExecutor<T> = [executor: () => T | PromiseLike<T>, ...args: MinimumDelayerArgs];
export type DelayerDetailedArgsExecutor<T> = [executor: () => T | PromiseLike<T>, ...args: MinimumDelayerDetailedArgs];

export type DelayerImmediateArgs = [delay: number, ...args: MinimumDelayerArgs];
export type DelayerDetailedImmediateArgs = [delay: number, ...args: MinimumDelayerDetailedArgs];
