/**
 * @file TryAgainLoop.ts
 * @author justKD
 * @copyright justKD 2020-present
 * @license MIT https://notnatural.co/license/mit/
 * @fileoverview `export class TryAgainLoop`
 */

export type TryAgainLoopParams = {
  qualifier: boolean;
  intervalInMS: number;
  callback: () => void;
  attempts?: number;
};

export class TryAgainLoop {
  qualifier: boolean;
  intervalInMS: number;
  callback: () => void;
  attempts: number;
  run: () => void;

  /**
   * @example
   * ```
   * type TryAgainLoopParams = {
   *    qualifier: boolean;
   *    intervalInMS: number;
   *    callback: () => void;
   *    attempts?: number;
   * };
   * ```
   */
  constructor(params: TryAgainLoopParams) {
    this.qualifier = params.qualifier;
    this.intervalInMS = params.intervalInMS;
    this.callback = params.callback;
    this.attempts = params.attempts ? params.attempts : 1;

    this.run = () => {
      let interval = setInterval(() => {
        if (!this.qualifier) {
          --this.attempts >= 0 ? this.callback() : (this.qualifier = true);
        } else {
          clearInterval(interval);
        }
      }, this.intervalInMS);
    };
  }
}
