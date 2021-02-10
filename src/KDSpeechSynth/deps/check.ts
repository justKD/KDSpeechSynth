/**
 * @file check.ts
 * @version 2.0.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2020
 * @license MIT
 * @fileoverview `export const check`
 * Make various assertions concerning type.
 * Includes error handling.
 */

type CheckFunction = (t: any) => boolean;
type CheckHasFunction = (t: any, key: string) => boolean;

const handleCheckError = (e: Error) => {
  console.groupCollapsed(e);
  console.trace();
  console.groupEnd();
  return false;
};

/**
 * Make various assertions concerning type.
 * Includes error handling.
 * ```
 * export const check: {
 *   exists: CheckFunction;
 *
 *   has: {
 *     key: CheckHasFunction;
 *     valueForKey: CheckHasFunction;
 *   };
 *
 *   is: {
 *     undefined: CheckFunction;
 *     null: CheckFunction;
 *     number: CheckFunction;
 *     safeNumber: CheckFunction;
 *     integer: CheckFunction;
 *     safeInteger: CheckFunction;
 *     boolean: CheckFunction;
 *     string: CheckFunction;
 *     function: CheckFunction;
 *     array: CheckFunction;
 *     genericObject: CheckFunction;
 *     arrayOf: (t: any, f: CheckFunction) => boolean;
 *     constructedFrom: (t: any, constructor: any) => boolean;
 *   };
 * }
 * ```
 */
export const check: {
  /**
   * Assert that the value is `!== undefined` and `!== null`.
   * @note See also `check.is.undefined()` and `check.is.null()`.
   * @param {any} t - Target value to be checked.
   * @returns {boolean}
   * @example
   * ```
   * let a;           // false
   * let b = false;   // true
   * let c = null;    // false
   * let d = 100;     // true
   *
   * check.exists(a);
   * ```
   */
  exists: CheckFunction;

  /**
   * Assert than an object has specific properties and/or values for properties.
   * @property {CheckHasFunction} key
   * @property {CheckHasFunction} valueForKey
   */
  has: {
    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value has the given key.
     * @note Returns `true` as long as the key exists on the target, even if
     * the value for that key is `undefined`.
     * @param {any} t - Target value to be checked.
     * @param {string} key - The target property key.
     * @returns {boolean}
     * @example
     * ```
     * let a = {
     *    one: 1,
     *    two: undefined,
     * };
     *
     * check.has.key(a, "one");   // true
     * check.has.key(a, "two");   // true
     * check.has.key(a, "three"); // false
     * ```
     */
    key: CheckHasFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value has the given key.
     * - Then assert that the value for that key is
     *   `!== undefined` and `!== null`.
     * @param {any} t - Target value to be checked.
     * @param {string} key - The target property key.
     * @returns {boolean}
     * @example
     * ```
     * let a = {
     *    one: 1,
     *    two: undefined,
     * };
     *
     * check.has.valueForKey(a, "one");   // true
     * check.has.valueForKey(a, "two");   // false
     * check.has.valueForKey(a, "three"); // false
     * ```
     */
    valueForKey: CheckHasFunction;
  };

  /**
   * Assert that a value is of a specific type.
   * @property {CheckFunction} number
   * @property {CheckFunction} safeNumber
   * @property {CheckFunction} integer
   * @property {CheckFunction} safeInteger
   * @property {CheckFunction} boolean
   * @property {CheckFunction} string
   * @property {CheckFunction} object
   * @property {CheckFunction} array
   * @property {CheckFunction} function
   * @property {CheckFunction} null
   * @property {CheckFunction} undefined
   * @property {t: any, constructor: any) => boolean} constructedFrom
   * @property {(t: any, f: CheckFunction)} arrayOf
   */
  is: {
    /**
     * - Assert that the value is specifically `=== undefined`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;           // true
     * let b = null;    // false
     * let c = 0;       // false
     * let d = false;   // false
     *
     * check.is.undefined(a);
     * ```
     */
    undefined: CheckFunction;

    /**
     * - Assert that the value is specifically `=== null`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;           // false
     * let b = null;    // true
     * let c = 0;       // false
     * let d = false;   // false
     *
     * check.is.null(a);
     * ```
     */
    null: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is of type `number`.
     *   - `True` for any `number`, including `NaN` and `Infinity`.
     *   - `False` for anything else, including `BigInt`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;             // false
     * let b = 100;       // true
     * let c = "100";     // false
     * let d = NaN;       // true
     *
     * let e = Infinity;  // true
     * let f = 0;         // true
     * let g = false;     // false
     *
     * check.is.number(a);
     * ```
     */
    number: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is of type `number`
     *   and can be safely used in js arithmetic.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;                             // false
     * let b = Number.MIN_SAFE_INTEGER;   // true
     * let c = Number.MAX_SAFE_INTEGER;   // true
     * let d = b - 10;                    // false
     * let e = c + 10;                    // false
     *
     * let f = NaN;                       // false
     * let g = Infinity;                  // false
     * let h = 100;                       // true
     * let i = "100";                     // false
     * let j = 0;                         // true
     *
     * check.is.safeNumber(a);
     * ```
     */
    safeNumber: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is of type `number`
     *   and can specifically be represented as an integer.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;                             // false
     * let b = Number.MIN_SAFE_INTEGER;   // true
     * let c = Number.MAX_SAFE_INTEGER;   // true
     * let d = b - 10;                    // true
     * let e = c + 10;                    // true
     *
     * let f = NaN;                       // false
     * let g = Infinity;                  // false
     * let h = 100;                       // true
     * let i = "100";                     // false
     * let j = 0;                         // true
     *
     * check.is.integer(a);
     * ```
     */
    integer: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is of type `number`,
     *   can be safely used in js arithmetic,
     *   and can specifically be represented as an integer.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;                             // false
     * let b = Number.MIN_SAFE_INTEGER;   // true
     * let c = Number.MAX_SAFE_INTEGER;   // true
     * let d = b - 10;                    // false
     * let e = c + 10;                    // false
     *
     * let f = NaN;                       // false
     * let g = Infinity;                  // false
     * let h = 100;                       // true
     * let i = "100";                     // false
     * let j = 0;                         // true
     *
     * check.is.safeInteger(a);
     * ```
     */
    safeInteger: CheckFunction;

    /**
     * - Assert that the value is of type `boolean`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;           // false
     * let b = true;    // true
     * let c = false;   // true
     * let d = 0;       // false
     * let e = "true";  // false
     *
     * check.is.boolean(a);
     * ```
     */
    boolean: CheckFunction;

    /**
     * - Assert that the value is of type `string`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;         // false
     * let b = "2";   // true
     * let c = 2;     // false
     *
     * check.is.string(a);
     * ```
     */
    string: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is specifically a `Function`.
     * @note This checks that the value can actually be called as a `Function`.
     * It does not check `typeof t` or `t.constructor`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;               // false
     * let b = () => {};    // true
     * let c = Date;        // true
     * let d = new Date();  // false
     *
     * check.is.function(a);
     * ```
     */
    function: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is specifically an `Array`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;                       // false
     * let b = {};                  // false
     * let c = [];                  // true
     *
     * let d = new Set([]);         // false
     * let e = new Uint32Array();   // false
     * let f = new Array(5);        // true
     *
     * check.is.array(a);
     * ```
     */
    array: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value constructor is `=== Object`.
     * @note Only values representing generic objects will return `true`.
     * Values created using the `new` keyword will be represented with their
     * specific constructors and will return `false`.
     * See `check.is.constructedFrom`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * @example
     * ```
     * let a;               // false
     * let b = {};          // true
     * let c = [];          // false
     * let d = () => {};    // true
     * let e = new Date();  // false
     *
     * check.is.genericObject(a);
     * ```
     */
    genericObject: CheckFunction;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the value is specifically an `Array` and has `length > 0`.
     * - Then assert that every value passes true for the given function.
     * @param {any} t - Target value to be checked.
     * @param {(x: any) => boolean} f - Function called on every member of the target array.
     * Every member in the `arrayOf` target value must pass true for `arrayOf` to pass true.
     * @returns {boolean}
     * @example
     * ```
     * const t = [0, 1, 2];
     * const f = (x) => typeof x === 'number';
     * check.arrayOf(t, f); // true
     *
     * const t = ['1', '2', '3'];
     * check.arrayOf(t, check.is.string); // true
     * ```
     */
    arrayOf: (t: any, f: CheckFunction) => boolean;

    /**
     * - Assert that the value is `!== undefined` and `!== null`.
     * - Then assert that the `constructor` argument
     *   can be called with the `new` keyword.
     * - Then assert that the value constructor is `=== constructor`.
     * @note Only values representing the provided constructor will return `true`.
     * Generic objects whose constructor `=== Object` will return `false`.
     * See `check.is.genericObject`.
     * @param {any} t - Target value to be checked.
     * @param {any} constructor - A valid constructor function.
     * @returns {boolean}
     * @example
     * ```
     * let a;
     * let b = {};
     * let c = new Date();
     *
     * check.is.constructedFrom(a, Date); // false
     * check.is.constructedFrom(b, Date); // false
     * check.is.constructedFrom(c, Date); // true
     * ```
     */
    constructedFrom: (t: any, constructor: any) => boolean;
  };
} = {
  exists: (t: any): boolean => {
    try {
      return t !== undefined && t !== null;
    } catch (e) {
      return handleCheckError(e);
    }
  },

  has: {
    key: (t: any, key: string): boolean => {
      try {
        if (!check.exists(t)) return false;
        return t.hasOwnProperty(key);
      } catch (e) {
        return handleCheckError(e);
      }
    },
    valueForKey: (t: any, key: string): boolean => {
      try {
        if (!check.has.key(t, key)) return false;
        return check.exists(t[key]);
      } catch (e) {
        return handleCheckError(e);
      }
    },
  },

  is: {
    undefined: (t: any): boolean => {
      try {
        return t === undefined;
      } catch (e) {
        return handleCheckError(e);
      }
    },

    null: (t: any): boolean => {
      try {
        return t === null;
      } catch (e) {
        return handleCheckError(e);
      }
    },

    number: (t: any): boolean => {
      try {
        if (!check.exists(t)) return false;
        return typeof t === "number";
      } catch (e) {
        return handleCheckError(e);
      }
    },

    safeNumber: (t: any): boolean => {
      try {
        if (!check.is.number(t)) return false;

        const n: number = t as number;
        const isFinite = Number.isFinite(n);
        const notTooBig = n <= Number.MAX_SAFE_INTEGER;
        const notTooSmall = n >= Number.MIN_SAFE_INTEGER;

        return isFinite && notTooBig && notTooSmall;
      } catch (e) {
        return handleCheckError(e);
      }
    },

    integer: (t: any): boolean => {
      try {
        if (!check.is.number(t)) return false;
        return Number.isInteger(t as number);
      } catch (e) {
        return handleCheckError(e);
      }
    },

    safeInteger: (t: any): boolean => {
      try {
        if (!check.is.safeNumber(t)) return false;
        return Number.isInteger(t as number);
      } catch (e) {
        return handleCheckError(e);
      }
    },

    boolean: (t: any): boolean => {
      try {
        return typeof t === "boolean";
      } catch (e) {
        return handleCheckError(e);
      }
    },

    string: (t: any): boolean => {
      try {
        return typeof t === "string";
      } catch (e) {
        return handleCheckError(e);
      }
    },

    function: (t: any): boolean => {
      try {
        if (!check.exists(t)) return false;
        return Object.prototype.toString.call(t) === "[object Function]";
      } catch (e) {
        return handleCheckError(e);
      }
    },

    array: (t: any): boolean => {
      try {
        if (!check.exists(t)) return false;
        return Array.isArray(t);
      } catch (e) {
        return handleCheckError(e);
      }
    },

    genericObject: (t: any): boolean => {
      try {
        if (!check.exists(t)) return false;
        return t["constructor"] === Object;
      } catch (e) {
        return handleCheckError(e);
      }
    },

    arrayOf: (t: any, f: (x: any) => boolean): boolean => {
      try {
        if (!check.is.array(t)) return false;
        if (!(t.length > 0)) return false;
        return t.every((x: any) => f(x));
      } catch (e) {
        return handleCheckError(e);
      }
    },

    constructedFrom: (t: any, constructor: any): boolean => {
      try {
        if (!check.exists(t)) return false;
        return t["constructor"] === constructor;
      } catch (e) {
        return handleCheckError(e);
      }
    },
  },
};
