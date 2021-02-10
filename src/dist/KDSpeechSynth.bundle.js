/**
 * @file KDSpeechSynth.bundle.js
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2020
 * @license MIT
 * @fileoverview
 * Class to simplify the use of the web speech synthesis engine.
 */

class KDLoop {
  constructor(params) {
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
class KDHistory extends Array {
  constructor() {
    super();
    let max = Number.MAX_SAFE_INTEGER;
    this.max = (size) => {
      if (size !== undefined) {
        if (Number.isSafeInteger(size)) {
          max = size;
        } else {
          console.log("maxHistory(size) must be a safe integer");
        }
      }
      return max;
    };
    this.push = (...items) => {
      let count = items.length;
      while (count--) if (this.length >= max) this.shift();
      super.push(items);
      return this.length;
    };
  }
}
const handleCheckError = (e) => {
  console.groupCollapsed(e);
  console.trace();
  console.groupEnd();
  return false;
};
const check = {
  exists: (t) => {
    try {
      return t !== undefined && t !== null;
    } catch (e) {
      return handleCheckError(e);
    }
  },
  has: {
    key: (t, key) => {
      try {
        if (!check.exists(t)) return false;
        return t.hasOwnProperty(key);
      } catch (e) {
        return handleCheckError(e);
      }
    },
    valueForKey: (t, key) => {
      try {
        if (!check.has.key(t, key)) return false;
        return check.exists(t[key]);
      } catch (e) {
        return handleCheckError(e);
      }
    },
  },
  is: {
    undefined: (t) => {
      try {
        return t === undefined;
      } catch (e) {
        return handleCheckError(e);
      }
    },
    null: (t) => {
      try {
        return t === null;
      } catch (e) {
        return handleCheckError(e);
      }
    },
    number: (t) => {
      try {
        if (!check.exists(t)) return false;
        return typeof t === "number";
      } catch (e) {
        return handleCheckError(e);
      }
    },
    safeNumber: (t) => {
      try {
        if (!check.is.number(t)) return false;
        const n = t;
        const isFinite = Number.isFinite(n);
        const notTooBig = n <= Number.MAX_SAFE_INTEGER;
        const notTooSmall = n >= Number.MIN_SAFE_INTEGER;
        return isFinite && notTooBig && notTooSmall;
      } catch (e) {
        return handleCheckError(e);
      }
    },
    integer: (t) => {
      try {
        if (!check.is.number(t)) return false;
        return Number.isInteger(t);
      } catch (e) {
        return handleCheckError(e);
      }
    },
    safeInteger: (t) => {
      try {
        if (!check.is.safeNumber(t)) return false;
        return Number.isInteger(t);
      } catch (e) {
        return handleCheckError(e);
      }
    },
    boolean: (t) => {
      try {
        return typeof t === "boolean";
      } catch (e) {
        return handleCheckError(e);
      }
    },
    string: (t) => {
      try {
        return typeof t === "string";
      } catch (e) {
        return handleCheckError(e);
      }
    },
    function: (t) => {
      try {
        if (!check.exists(t)) return false;
        return Object.prototype.toString.call(t) === "[object Function]";
      } catch (e) {
        return handleCheckError(e);
      }
    },
    array: (t) => {
      try {
        if (!check.exists(t)) return false;
        return Array.isArray(t);
      } catch (e) {
        return handleCheckError(e);
      }
    },
    genericObject: (t) => {
      try {
        if (!check.exists(t)) return false;
        return t["constructor"] === Object;
      } catch (e) {
        return handleCheckError(e);
      }
    },
    arrayOf: (t, f) => {
      try {
        if (!check.is.array(t)) return false;
        if (!(t.length > 0)) return false;
        return t.every((x) => f(x));
      } catch (e) {
        return handleCheckError(e);
      }
    },
    constructedFrom: (t, constructor) => {
      try {
        if (!check.exists(t)) return false;
        return t["constructor"] === constructor;
      } catch (e) {
        return handleCheckError(e);
      }
    },
  },
};
class KDSpeechSynth {
  constructor(params) {
    const _self = { synth: window["speechSynthesis"], voices: [] };
    const self = {
      ready: false,
      text: (params === null || params === void 0 ? void 0 : params.text)
        ? params.text
        : "",
      voice: (params === null || params === void 0 ? void 0 : params.voice)
        ? params.voice
        : 0,
      maxHistory: (
        params === null || params === void 0 ? void 0 : params.maxHistory
      )
        ? params.maxHistory
        : 0,
      history: new KDHistory(),
      volume: (params === null || params === void 0 ? void 0 : params.volume)
        ? params.volume
        : 1.0,
      rate: (params === null || params === void 0 ? void 0 : params.rate)
        ? params.rate
        : 1.0,
      pitch: (params === null || params === void 0 ? void 0 : params.pitch)
        ? params.pitch
        : 1.0,
      onSpeakStart: (
        params === null || params === void 0 ? void 0 : params.onSpeakStart
      )
        ? params.onSpeakStart
        : undefined,
      onSpeakEnd: (
        params === null || params === void 0 ? void 0 : params.onSpeakEnd
      )
        ? params.onSpeakEnd
        : undefined,
      onError: (params === null || params === void 0 ? void 0 : params.onError)
        ? params.onError
        : undefined,
      onPause: (params === null || params === void 0 ? void 0 : params.onPause)
        ? params.onPause
        : undefined,
      onResume: (
        params === null || params === void 0 ? void 0 : params.onResume
      )
        ? params.onResume
        : undefined,
      onMark: (params === null || params === void 0 ? void 0 : params.onMark)
        ? params.onMark
        : undefined,
      onBoundary: (
        params === null || params === void 0 ? void 0 : params.onBoundary
      )
        ? params.onBoundary
        : undefined,
      onVoicesChanged: (
        params === null || params === void 0 ? void 0 : params.onVoicesChanged
      )
        ? params.onVoicesChanged
        : undefined,
    };
    const $ = {
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
        const clipMin = (v) => Math.max(range[0], v);
        const clipMax = (v) => Math.min(v, range[1]);
        const clipped = clipMax(clipMin(value));
        return clipped;
      },
    };
    const _ = {
      listVoices: () => {
        const voices = _self.voices.map((voice) => {
          let text = `${voice.name} (${voice.lang})`;
          if (voice.default) text += " -- DEFAULT";
          return text;
        });
        return voices;
      },
      voice: (voice) => {
        if (check.is.safeInteger(voice)) self.voice = voice;
        return self.voice;
      },
      rate: (rate) => {
        if (check.is.safeNumber(rate)) {
          self.rate = $.clip(rate, [0.1, 10]);
        }
        return self.rate;
      },
      pitch: (pitch) => {
        if (check.is.safeNumber(pitch)) {
          self.pitch = $.clip(pitch, [0, 2]);
        }
        return self.pitch;
      },
      volume: (volume) => {
        if (check.is.safeNumber(volume)) {
          self.volume = $.clip(volume, [0, 1]);
        }
        return self.volume;
      },
      text: (text) => {
        if (check.is.string(text)) self.text = text;
        return self.text;
      },
      queue: (text, skipHistory = false) => {
        if (!self.ready) {
          console.error("SpeechSynth is not ready.");
          return;
        }
        if (check.is.string(text)) self.text = text;
        if (!check.is.string(self.text) || self.text === "") {
          console.error("No text for SpeechSynth to speak.");
          return;
        }
        if (!skipHistory) self.history.push(text);
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
        const getUtterance = () => {
          const utterance = new SpeechSynthesisUtterance(self.text);
          const voice = getVoice();
          if (check.exists(voice)) {
            utterance.voice = voice;
          }
          utterance.pitch = self.pitch;
          utterance.rate = self.rate;
          utterance.volume = self.volume;
          utterance.onstart = self.onSpeakStart;
          utterance.onend = self.onSpeakEnd;
          utterance.onerror = (e) => {
            console.error(`SpeechSynthesisUtterance.onerror - ${e.error}`);
            if (self === null || self === void 0 ? void 0 : self.onError)
              self.onError(e);
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
            value: this[key],
            writable: false,
            enumerable: true,
          });
        });
      },
      onReadyCheck: () => {
        const onReadyKey = "onReady";
        if (
          check.has.key(params, onReadyKey) &&
          check.is.function(params[onReadyKey])
        ) {
          const cb = (loop) => {
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
const Module = KDSpeechSynth;
const moduleName = "KDSpeechSynth";
const namespace = "kd";
const handleNonModule = function (exports) {
  exports[moduleName] = Module;
};
(function (declareExports) {
  const root = window;
  const rootDefine = root["define"];
  const amdRequire = root && typeof rootDefine === "function" && rootDefine.amd;
  const esm = typeof module === "object" && typeof exports === "object";
  const nonmodule = root;
  if (amdRequire) {
    root["define"](["exports"], declareExports);
    return;
  }
  if (esm) {
    exports !== null && declareExports(exports);
    module !== null && (module.exports = exports);
    return;
  }
  if (nonmodule) {
    declareExports((root[namespace] = root[namespace] || {}));
    return;
  }
  console.warn(
    "Unable to load as ES module. Use AMD, CJS, add an export, or use as non-module script.",
  );
})(handleNonModule);
