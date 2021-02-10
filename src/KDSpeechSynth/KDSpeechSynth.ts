/**
 * @file KDSpeechSynth.ts
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2020
 * @license MIT
 * @fileoverview `export const KDSpeechSynth`
 * Class to simplify the use of the web speech synthesis engine.
 */

import { KDLoop } from "./deps/KDLoop";
import { KDHistory } from "./deps/KDHistory";
import { check } from "./deps/check";

export type KDSpeechSynthParams = {
  voice?: number;
  text?: string;
  rate?: number; // 0.1 - 10
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
  maxHistory?: number;
  onReady?: () => void;
  onSpeakStart?: (e: any) => void;
  onSpeakEnd?: (e: any) => void;
  onError?: (e: any) => void;
  onPause?: (e: any) => void;
  onResume?: (e: any) => void;
  onMark?: (e: any) => void;
  onBoundary?: (e: any) => void;
  onVoicesChanged?: (e: any) => void;
};

/**
 * Class to simplify the use of the web speech synthesis engine.
 * @note Similar to the web audio api, web speech synthesis requires
 * user interaction to enable in the browser. The first call to
 * `KDSpeechSynth.speak` or `KDSpeechSynth.queue` needs to be tied
 * to user input.
 */
export class KDSpeechSynth {
  /**
   * @returns `string[]` describing available voices.
   */
  voices: () => string[];

  /**
   * Get/set the voice index to use when speaking.
   * @param {number} [voice] - An index number matching the
   * position of the chosen voice retrieved from `voices`.
   * @returns `number` index of the currently selected voice.
   */
  voice: (voice?: number) => number;

  /**
   * Queue the param or previously set text (see the `text`
   * method) for speech synthesis. Creates an utterance with
   * the current settings and adds it to the speech synth queue.
   * Automatically adds the intended text to the speech
   * history unless `skipHistory` is set `true`.
   * @param {string} [text] - The text to be spoken. If empty,
   * any text set with `text` will be used instead. Accepts
   * valid SSML strings.
   * @param {boolean} [skipHistory] - If `true`, the text
   * will not be added to the internally held history.
   */
  queue: (text?: string, skipHistory?: boolean) => void;

  /**
   * Speak the param or previously set text without
   * waiting for previously queued utterances to complete.
   * Creates an utterance with the current settings and adds
   * it to the speech synth queue. Also adds the intended text
   * to the speech history unless `skipHistory` is set `true`.
   * @note Automatically cancels any current speech AND any queued utterances.
   * @param {string} [text] - The text to be spoken. If empty,
   * any text set with `text` will be used instead. Accepts
   * valid SSML strings.
   * @param {boolean} [skipHistory] - If `true`, the text
   * will not be added to the internally held history.
   */
  speak: (text?: string, skipHistory?: boolean) => void;

  /**
   * Called when the speech synth begins speaking.
   * @param {(e: any) => void} callback
   */
  onSpeakStart: (callback: (e: any) => void) => void;

  /**
   * Called when the speech synth completes an utterance.
   * @param {(e: any) => void} callback
   */
  onSpeakEnd: (callback: (e: any) => void) => void;

  /**
   * Called if there is an error when attempting to speak.
   * @param {(e: any) => void} callback
   */
  onError: (callback: (e: any) => void) => void;

  /**
   * Called when the speech synth is paused.
   * @param {(e: any) => void} callback
   */
  onPause: (callback: (e: any) => void) => void;

  /**
   * Called when the speech synth is resumed after being paused.
   * @param {(e: any) => void} callback
   */
  onResume: (callback: (e: any) => void) => void;

  /**
   * Called when a marker is reached in the utterance text.
   * Markers are a part of speech synthesis markup language
   * (SSML), which can be used to create input text strings.
   * @param {(e: any) => void} callback
   */
  onMark: (callback: (e: any) => void) => void;

  /**
   * Called when a word or sentence boundary is reached.
   * Access the type of boundary via the callback event
   * parameter `event.name`.
   * @param {(e: any) => void} callback
   */
  onBoundary: (callback: (e: any) => void) => void;

  /**
   * Called if the voices available to the current synth change
   * for whatever reason. Will always automatically update the voices
   * internally, but this callback lets you add extra instructions
   * to the response.
   * @param {(e: any) => void} callback
   */
  onVoicesChanged: (callback: (e: any) => void) => void;

  /**
   * Set the text that should be spoken when `speak` is called
   * without an input param.
   * @param {string} [text] - The text to be spoken when `speak`
   * or `queue` are called without a text input. Accepts valid
   * SSML strings.
   */
  text: (text?: string) => string;

  /**
   * Set the relative speech rate. Checks that the input
   * is a safe number and clips to the range of 0.1 - 10.
   * @param {number} [rate]
   */
  rate: (rate?: number) => number;

  /**
   * Set the relative speech pitch. Checks that the input
   * is a safe number and clips to the range of 0 - 2.
   * @param {number} [pitch]
   */
  pitch: (pitch?: number) => number;

  /**
   * Set the relative speech volume. Checks that the input
   * is a safe number and clips to the range of 0 - 1.
   * @param {number} [volume]
   */
  volume: (volume?: number) => number;

  /**
   * @returns `true` if the synth is initialized and there
   * are valid voices available.
   */
  isReady: () => boolean;

  /**
   * @returns `true` if the synth is currently speaking.
   */
  isSpeaking: () => boolean;

  /**
   * @returns `true` if the synth has utterances in the queue.
   */
  isPending: () => boolean;

  /**
   * @returns `true` if the synth is paused.
   */
  isPaused: () => boolean;

  /**
   * Cancels any current speech as well as any utterances
   * in the synth's queue.
   */
  cancel: () => void;

  /**
   * Pause the synth.
   */
  pause: () => void;

  /**
   * Resume speaking if paused.
   */
  resume: () => void;

  /**
   * @returns `string[]` holding the current history.
   */
  history: () => string[];

  /**
   * Get/set the maximum number of text allowed
   * by the internal history. When the maximum is reached, the
   * history will remove the oldest element in order to make room
   * for a new addition.
   * @param {number} [max] - If empty, `maxHistory` will
   * only return the current `maxHistory` value. Default is
   * `Number.MAX_SAFE_INTEGER`. Otherise, must be an integer
   * and sets the maximum history length.
   * @returns `number` current value.
   */
  maxHistory: (max?: number) => number;

  /**
   * Resets the current `history` to an empty array. Automatically
   * sets the new history maximum to the current `maxHistory`.
   */
  clearHistory: () => void;

  /**
   * Simplify the use of the web speech synthesis engine.
   * @note Similar to the web audio api, web speech synthesis requires
   * user interaction to enable in the browser. The first call to
   * `KDSpeechSynth.speak` or `KDSpeechSynth.queue` needs to be tied
   * to user input.
   * @param {KDSpeechSynthParams} [params] `KDSpeechSynthParams` object.
   * ```
   * export type KDSpeechSynthParams = {
   *   voice?: number;
   *   text?: string;
   *   rate?: number;    // 0.1 - 10
   *   pitch?: number;   // 0 - 2
   *   volume?: number;  // 0 - 1
   *   maxHistory?: number;
   *   onReady?: () => void;
   *   onSpeakStart?: (e: any) => void;
   *   onSpeakEnd?: (e: any) => void;
   *   onError?: (e: any) => void;
   *   onPause?: (e: any) => void;
   *   onResume?: (e: any) => void;
   *   onMark?: (e: any) => void;
   *   onBoundary?: (e: any) => void;
   *   onVoicesChanged?: (e: any) => void;
   * };
   * ```
   * @note
   * ```
   * class KDSpeechSynth {
   *  voices: () => string[];
   *  voice: (voice?: number) => number;
   *  queue: (text?: string, skipHistory?: boolean) => void;
   *  speak: (text?: string, skipHistory?: boolean) => void;
   *  onSpeakStart: (callback: (e: any) => void) => void;
   *  onSpeakEnd: (callback: (e: any) => void) => void;
   *  onError: (callback: (e: any) => void) => void;
   *  onPause: (callback: (e: any) => void) => void;
   *  onResume: (callback: (e: any) => void) => void;
   *  onMark: (callback: (e: any) => void) => void;
   *  onBoundary: (callback: (e: any) => void) => void;
   *  onVoicesChanged: (callback: (e: any) => void) => void;
   *  text: (text?: string) => string;
   *  rate: (rate?: number) => number;
   *  pitch: (pitch?: number) => number;
   *  volume: (volume?: number) => number;
   *  isReady: () => boolean;
   *  isSpeaking: () => boolean;
   *  isPending: () => boolean;
   *  isPaused: () => boolean;
   *  cancel: () => void;
   *  pause: () => void;
   *  resume: () => void;
   *  history: () => string[];
   *  maxHistory: (max?: number) => number;
   *  clearHistory: () => void;
   * }
   * ```
   * @example
   * ```
   * const synth = new KDSpeechSynth();
   * synth.speak("hello");
   * ```
   * ```
   * const synth = new KDSpeechSynth({
   *  rate: 2,
   *  onSpeakStart: (e) => console.log(e),
   *  onReady: () => {
   *    console.log( synth.voices() );
   *    synth.voice(2);
   *    synth.queue("say this");
   *    synth.queue("then say this");
   *    console.log( synth.history() );
   *  },
   * });
   * ```
   */
  constructor(params?: KDSpeechSynthParams) {
    const _self: {
      /* eslint-disable-next-line no-undef */
      synth: SpeechSynthesis;
      /* eslint-disable-next-line no-undef */
      voices: SpeechSynthesisVoice[];
    } = {
      synth: window["speechSynthesis"],
      voices: [],
    };

    const self: {
      ready: boolean;
      text: string;
      voice: number;
      maxHistory: number;
      history: KDHistory;
      volume: number;
      rate: number;
      pitch: number;
      onSpeakStart: (e: any) => void;
      onSpeakEnd: (e: any) => void;
      onError: (e: any) => void;
      onPause: (e: any) => void;
      onResume: (e: any) => void;
      onMark: (e: any) => void;
      onBoundary: (e: any) => void;
      onVoicesChanged: (e: any) => void;
    } = {
      ready: false,
      text: params?.text ? params.text : "",
      voice: params?.voice ? params.voice : 0,
      maxHistory: params?.maxHistory ? params.maxHistory : 0,
      history: new KDHistory(),
      volume: params?.volume ? params.volume : 1.0, // 0 - 1
      rate: params?.rate ? params.rate : 1.0, // 0.1 - 10
      pitch: params?.pitch ? params.pitch : 1.0, // 0 - 2
      onSpeakStart: params?.onSpeakStart ? params.onSpeakStart : undefined,
      onSpeakEnd: params?.onSpeakEnd ? params.onSpeakEnd : undefined,
      onError: params?.onError ? params.onError : undefined,
      onPause: params?.onPause ? params.onPause : undefined,
      onResume: params?.onResume ? params.onResume : undefined,
      onMark: params?.onMark ? params.onMark : undefined,
      onBoundary: params?.onBoundary ? params.onBoundary : undefined,
      onVoicesChanged: params?.onVoicesChanged
        ? params.onVoicesChanged
        : undefined,
    };

    const $: {
      /**
       * Retrieve and sort available voices.
       * Sets `self.ready`.
       */
      updateVoices: () => void;

      /**
       * Retrieves a list of sorted voices if possible.
       * Returns an empty array even if it fails.
       */
      /* eslint-disable-next-line no-undef */
      getVoices: () => SpeechSynthesisVoice[];

      /**
       * Limit a value to a hard minimum and maximum.
       * @param {number} value - The original value.
       * @param {[number, number]} range - The `[min, max]` allowed values.
       * @returns {number} The clipped `number`.
       * @example
       * const n: number = 3.75;
       * const clipped: number = clip(n, [0, 3]); // clipped == 3.0
       */
      clip: (value: number, range: [number, number]) => number;
    } = {
      updateVoices: () => {
        _self.voices = $.getVoices();
        self.ready = _self.voices.length > 0;
      },

      getVoices: () => {
        if (check.exists(_self.synth)) {
          return _self.synth.getVoices().sort((a, b) => {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            else if (aname === bname) return 0;
            else return 1;
          });
        } else {
          return [];
        }
      },

      clip: (value, range) => {
        const clipMin = (v: number) => Math.max(range[0], v);
        const clipMax = (v: number) => Math.min(v, range[1]);
        const clipped = clipMax(clipMin(value));
        return clipped;
      },
    };

    const _: {
      listVoices: () => string[];
      voice: (voice?: number) => number;
      rate: (rate?: number) => number;
      pitch: (pitch?: number) => number;
      volume: (volume?: number) => number;
      text: (text?: string) => string;
      queue: (text?: string, skipHistory?: boolean) => void;
      speak: (text?: string, skipHistory?: boolean) => void;
      onSpeakStart: (callback: (e: any) => void) => void;
      onSpeakEnd: (callback: (e: any) => void) => void;
      onError: (callback: (e: any) => void) => void;
      onPause: (callback: (e: any) => void) => void;
      onResume: (callback: (e: any) => void) => void;
      onMark: (callback: (e: any) => void) => void;
      onBoundary: (callback: (e: any) => void) => void;
      onVoicesChanged: (callback: (e: any) => void) => void;
      isReady: () => boolean;
      isSpeaking: () => boolean;
      isPending: () => boolean;
      isPaused: () => boolean;
      cancel: () => void;
      pause: () => void;
      resume: () => void;
      maxHistory: (max?: number) => number;
      history: () => string[];
      clearHistory: () => void;
    } = {
      listVoices: (): string[] => {
        const voices: string[] = _self.voices.map((voice) => {
          let text = `${voice.name} (${voice.lang})`;
          if (voice.default) text += " -- DEFAULT";
          return text;
        });
        return voices;
      },

      voice: (voice?: number): number => {
        if (check.is.safeInteger(voice)) self.voice = voice;
        return self.voice;
      },

      rate: (rate?: number): number => {
        if (check.is.safeNumber(rate)) {
          self.rate = $.clip(rate, [0.1, 10]);
        }
        return self.rate;
      },

      pitch: (pitch?: number): number => {
        if (check.is.safeNumber(pitch)) {
          self.pitch = $.clip(pitch, [0, 2]);
        }
        return self.pitch;
      },

      volume: (volume?: number): number => {
        if (check.is.safeNumber(volume)) {
          self.volume = $.clip(volume, [0, 1]);
        }
        return self.volume;
      },

      text: (text?: string): string => {
        if (check.is.string(text)) self.text = text;
        return self.text;
      },

      queue: (text, skipHistory = false) => {
        /* Ensure SpeechSynth is initialized. */
        if (!self.ready) {
          console.error("SpeechSynth is not ready.");
          return;
        }

        /* Set new text if available. */
        if (check.is.string(text)) self.text = text;

        /* Guard against invalid text. */
        if (!check.is.string(self.text) || self.text === "") {
          console.error("No text for SpeechSynth to speak.");
          return;
        }

        /* Add to history if not skipped. */
        if (!skipHistory) self.history.push(text);

        /* Retrieve the currently selected voice. */
        const getVoice = () => {
          if (_self.voices.length > 0) {
            return _self.voices.length >= self.voice
              ? _self.voices[self.voice]
              : _self.voices[0];
          } else {
            console.error("Unable to find any voices.");
            return;
          }
        };

        /* Create an utterance with the current settings. */
        const getUtterance = (): SpeechSynthesisUtterance => {
          const utterance = new SpeechSynthesisUtterance(self.text);

          const voice = getVoice();
          if (check.exists(voice)) {
            /* eslint-disable-next-line no-undef */
            utterance.voice = voice as SpeechSynthesisVoice;
          }

          utterance.pitch = self.pitch;
          utterance.rate = self.rate;
          utterance.volume = self.volume;

          utterance.onstart = self.onSpeakStart;
          utterance.onend = self.onSpeakEnd;
          utterance.onerror = (e) => {
            console.error(`SpeechSynthesisUtterance.onerror - ${e.error}`);
            if (self?.onError) self.onError(e);
          };
          utterance.onpause = self.onPause;
          utterance.onresume = self.onResume;
          utterance.onmark = self.onMark;
          utterance.onboundary = self.onBoundary;

          return utterance;
        };

        const utterThis = getUtterance();
        _self.synth.speak(utterThis);
      },

      speak: (text, skipHistory = false) => {
        const synth = _self.synth;
        const shouldCancel = synth.speaking || synth.pending || synth.paused;
        if (shouldCancel) _.cancel();
        _.queue(text, skipHistory);
      },

      onSpeakEnd: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onSpeakEnd = callback;
      },

      onSpeakStart: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onSpeakStart = callback;
      },

      onError: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onError = callback;
      },
      onPause: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onPause = callback;
      },
      onResume: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onResume = callback;
      },
      onMark: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onMark = callback;
      },
      onBoundary: (callback) => {
        if (check.is.function(callback) || check.is.undefined(callback))
          self.onBoundary = callback;
      },

      onVoicesChanged: (callback) => {
        if (check.is.function(callback)) {
          if (check.exists(_self.synth)) {
            self.onVoicesChanged = callback;
            _self.synth.onvoiceschanged = (e) => {
              $.updateVoices();
              self.onVoicesChanged(e);
            };
          }
        }
      },

      isReady: () => self.ready,
      isSpeaking: () => _self.synth.speaking,
      isPending: () => _self.synth.pending,
      isPaused: () => _self.synth.paused,

      cancel: () => _self.synth.cancel(),
      pause: () => _self.synth.pause(),
      resume: () => _self.synth.resume(),

      history: () => Array.from(self.history),
      maxHistory: (max) => {
        /* Only attempt to set if max is not undefined, null, or 0. */
        if (max) {
          if (check.is.safeInteger(max)) {
            self.maxHistory = Math.abs(self.maxHistory);
            self.history.max(self.maxHistory);
          } else {
            console.warn("maxHistory must be an integer.");
          }
        }
        return self.history.max();
      },
      clearHistory: () => {
        self.history = new KDHistory();
        if (self.maxHistory) self.history.max(self.maxHistory);
      },
    };

    this.voices = () => _.listVoices();
    this.voice = (voice) => _.voice(voice);

    this.text = (text) => _.text(text);
    this.rate = (rate) => _.rate(rate);
    this.pitch = (pitch) => _.pitch(pitch);
    this.volume = (volume) => _.volume(volume);

    this.isReady = () => _.isReady();
    this.isSpeaking = () => _.isSpeaking();
    this.isPending = () => _.isPending();
    this.isPaused = () => _.isPaused();

    this.queue = (text, skipHistory = false) => _.queue(text, skipHistory);
    this.speak = (text, skipHistory = false) => _.speak(text, skipHistory);
    this.cancel = () => _.cancel();
    this.pause = () => _.pause();
    this.resume = () => _.resume();

    this.onSpeakStart = (callback) => _.onSpeakStart(callback);
    this.onSpeakEnd = (callback) => _.onSpeakEnd(callback);
    this.onError = (callback) => _.onError(callback);
    this.onPause = (callback) => _.onPause(callback);
    this.onResume = (callback) => _.onResume(callback);
    this.onMark = (callback) => _.onMark(callback);
    this.onBoundary = (callback) => _.onBoundary(callback);
    this.onVoicesChanged = (callback) => _.onVoicesChanged(callback);

    this.maxHistory = (size) => _.maxHistory(size);
    this.history = () => _.history();
    this.clearHistory = () => _.clearHistory();

    const init = {
      run: () => {
        if (!_self.synth) {
          console.error("Unable to initialize SpeechSynth.");
          return;
        }
        init.voices();
        init.readOnly();
        init.onReadyCheck();
      },

      voices: () => {
        $.updateVoices();
        _self.synth.onvoiceschanged = () => {
          $.updateVoices();
        };
      },

      readOnly: () => {
        Object.keys(this).forEach((key) => {
          Object.defineProperty(this, key, {
            value: (this as any)[key],
            writable: false,
            enumerable: true,
          });
        });
      },

      /**
       * Since the `KDSpeechSynth` ready state is dependent on the
       * Web Speech API retrieving available voices from the system,
       * this will attempt to run the `onReady` callback (if one is
       * passed in the params object) via a loop. It will check the
       * ready state 20 times in 20ms intervals, breaking the loop
       * on success or if the maximum attempts is reached.
       */
      onReadyCheck: () => {
        const onReadyKey = "onReady";
        if (
          check.has.key(params, onReadyKey) &&
          check.is.function(params[onReadyKey])
        ) {
          const cb = (loop: KDLoop) => {
            if (self.ready) {
              params[onReadyKey]();
              loop.break();
            }

            if (!loop.remaining) {
              console.log(`failed onReady callback after ${loop.max} attempts`);
            }
          };

          const loop = new KDLoop({
            intervalInMs: 20,
            attempts: 20,
            callback: cb,
          });

          loop.run();
        }
      },
    };

    init.run();
  }
}
