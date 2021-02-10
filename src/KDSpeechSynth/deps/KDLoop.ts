/**
 * @file KDLoop.ts
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2020
 * @license MIT
 * @fileoverview `export class Loop`
 * Create a synchronous, breakable callback loop.
 */

type KDLoopParamsType = {
  callback: (loop: KDLoop) => void;
  intervalInMs?: number;
  attempts?: number;
};

/**
 * Create a synchronous, breakable callback loop.
 * @note Runs the callback up to the given number of attempts
 * (default is just `1` attempt). If the `intervalInMs` property
 * is set, it will wait that duration between each run. Break out
 * of the loop early with `break()`.
 * @example
 * ```
 * const cb = (loop) => {
 *     console.log('run loop');
 *
 *     const someSuccessTest = loop.remaining <= 25;
 *
 *     if (someSuccessTest) {
 *       const attempts = loop.max - loop.remaining;
 *       console.log(`success after ${attempts} attempts`);
 *       loop.break();
 *     }
 *
 *     if (!loop.remaining) {
 *       console.log(`failed after ${loop.max} attempts`);
 *     }
 * };
 *
 * const loop = new KDLoop({
 *   attempts: 50,
 *   callback: cb,
 * });
 *
 * loop.run();
 * ```
 */
export class KDLoop {
  callback: (loop: KDLoop) => void;
  intervalInMs?: number;
  remaining?: number;
  max?: number;
  run: () => void;
  break: () => void;

  constructor(params: KDLoopParamsType) {
    let qualifier = true;
    const max = params.attempts ? params.attempts : 1;

    this.max = max;
    this.callback = params.callback;
    this.intervalInMs = params.intervalInMs ? params.intervalInMs : 0;
    this.remaining = max;

    this.run = () => {
      if (this.remaining-- > 0 && qualifier) {
        this.callback(this);

        if (this.intervalInMs) {
          setTimeout(() => {
            this.run();
          }, this.intervalInMs);
        } else {
          this.run();
        }
      }
    };

    this.break = () => {
      qualifier = false;
    };
  }
}
