type PromiseFn<Parameters extends any[] = any[], ReturnType = any> = (...args: Parameters) => Promise<ReturnType>;

export const delay = (interval: number) =>
  new Promise<void>(resolve => setTimeout(resolve, interval));

export class PromiseDelayEngine<
  Fn extends PromiseFn<Parameters, ReturnType> = PromiseFn,
  Parameters extends any[] = any[],
  ReturnType = any,
  PoolItem extends { fn: Fn; destroy: boolean; } = { fn: Fn; destroy: boolean; },
> {
  /** 记录下一次能执行函数的时间戳 (ms) */
  private nextTimestamp = -1;
  private pool: PoolItem[] = [];

  constructor(public originalFn: Fn, /** ms */ public interval: number) {

  }

  // @ts-ignore
  public fn: Fn = (...args: Parameters): Promise<ReturnType> => {
    const now = Date.now();

    if (this.nextTimestamp === -1) {
      this.nextTimestamp = now + this.interval;
    } else {
      this.nextTimestamp += this.interval;
    }

    const diff = this.nextTimestamp > now ? this.nextTimestamp - now : 0;

    // @ts-ignore
    const poolItem: PoolItem = {
      fn: this.originalFn,
      destroy: false,
    };
    this.pool.push(poolItem);

    return delay(diff)
      .then(() => {
        poolItem.destroy = true;
        const index = this.pool.findIndex(item => item === poolItem);
        this.pool = this.pool.splice(index, 1);
      })
      .then(() => this.originalFn(...args));
  }
}

export const promiseDelay = <Fn extends PromiseFn>(fn: Fn, interval: number): Fn => {
  const engine = new PromiseDelayEngine<Fn>(fn, interval);
  return engine.fn;
};
