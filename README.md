# KDSpeechSynthJS

by [@justKD](https://github.com/justKD)

v1.0.0

KDSpeechSynthJS is a Typescript class simplifying the use of [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).

---

### Example Uses

Import the class into your module:

```
import { KDSpeechSynth } from  "path/to/KDSpeechSynth";
```

The simplest example uses the Web Speech API defaults:

```
const synth =  new  KDSpeechSynth();
synth.speak("This is KDSpeechSynthesisJS.");
```

You can also pass any of the optional parameters including event hook callbacks:

```
const synth =  new  KDSpeechSynth({
	text:  "This is KDSpeechSynthesisJS.",
	voice: 38,
	rate: 0.75,
	pitch: 0.5,
	onSpeakStart: (e:  any) =>  console.log("start"),
	onSpeakEnd: (e:  any) =>  console.log("end"),
});
synth.speak();
```

Or set/change parameters after initialization:

```
const synth =  new  KDSpeechSynth();
synth.voice(11);
synth.rate(1.1);
synth.volume(0.5);
synth.text("The text that should be spoken.");
synth.onPause(() => console.log("paused"));
```

Control the synth during use:

```
const synth =  new  KDSpeechSynth();
synth.speak("This is KDSpeechSynthesisJS.");
setTimeout(() => synth.pause(), 500);
setTimeout(() => synth.resume(), 1000);
```

Of course the instance can report various tidbits about its own state:

```
const synth =  new  KDSpeechSynth();

const listOfAvailableVoices 	= synth.voices();
const theCurrentVoice 			= synth.voice();
const theCurrentVolume 			= synth.volume();
const theCurrentReadyState 		= synth.isReady();
const theCurrentSpeakingState 	= synth.isSpeaking();

console.log([
	listOfAvailableVoices,
	theCurrentVoice,
	theCurrentVolume,
	theCurrentReadyState,
	theCurrentSpeakingState,
]));
```

Each instance also maintains an internal history of spoken text:

```
const synth =  new  KDSpeechSynth();

synth.onSpeakEnd(() => {
	synth.onSpeakEnd(() => {
		synth.clearHistory();
		console.log(synth.history());
	});
	synth.speak("This is the second line of text.");
	console.log(synth.history());
});

synth.speak("This is KDSpeechSynthesisJS.");
console.log(synth.history());
```

---

### API

| Method                   | Type                                         | Description                                                                                                                                                                                                                                |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `this.synth()`           | `() => SpeechSynthesis`                      | Return the internal SpeechSynthesis object.                                                                                                                                                                                                |
| `this.voices()`          | `() => string[]`                             | Return an `array` containing all available voices.                                                                                                                                                                                         |
| `this.voice()`           | `(voice?: number) => number`                 | Set the voice to use. If parameter is empty, returns the currently set voice. Expects an `integer`.                                                                                                                                        |
| `this.text()`            | `(text?: string) => string`                  | Set the text to be used when `this.speak()` is called with an empty `text` parameter.                                                                                                                                                      |
| `this.speak()`           | `(text?: string, noStore?: boolean) => void` | Speak the passed text string and update `this.text()`. If `text` is empty, will speak the currently stored `this.text()` string. The `noStore` default is `false` and determines if the spoken text will be added to the internal history. |
| `this.rate()`            | `(rate?: number) => number`                  | Set the `SpeechSynthesis` rate between `0.1` and `10.0`. If empty, returns the current value.                                                                                                                                              |
| `this.pitch()`           | `(pitch?: number) => number`                 | Set the `SpeechSynthesis` pitch between `0.0` and `2.0`. If empty, returns the current value.                                                                                                                                              |
| `this.volume()`          | `(volume?: number) => number`                | Set the `SpeechSynthesis` volume between `0.0` and `1.0`. If empty, returns the current value.                                                                                                                                             |
| `this.pause()`           | `() => void`                                 | Pauses the `SpeechSynthesis` engine if it is already running.                                                                                                                                                                              |
| `this.resume()`          | `() => void`                                 | Resumes the `SpeechSynthesis` engine if it is currently paused.                                                                                                                                                                            |
| `this.cancel()`          | `() => void`                                 | Cancels the `SpeechSynthesis` engine if it is currently running. Can not be resumed.                                                                                                                                                       |
| `this.onSpeakStart()`    | `(callback: (e: any) => void) => void`       | Parameter is called when speech begins.                                                                                                                                                                                                    |
| `this.onSpeakEnd()`      | `(callback: (e: any) => void) => void`       | Parameter is called when speech ends.                                                                                                                                                                                                      |
| `this.onError()`         | `(callback: (e: any) => void) => void`       | Parameter is called on `SpeechSynthesis` error.                                                                                                                                                                                            |
| `this.onPause()`         | `(callback: (e: any) => void) => void`       | Parameter is called when `this.pause()` is invoked.                                                                                                                                                                                        |
| `this.onResume()`        | `(callback: (e: any) => void) => void`       | Parameter is called when `this.resume()` is invoked.                                                                                                                                                                                       |
| `this.onVoicesChanged()` | `(callback: (e: any) => void) => void`       | Parameter is called if the list of available voices changes.                                                                                                                                                                               |
| `this.isReady()`         | `() => boolean`                              | Returns `true` if the instance is ready and available for speech.                                                                                                                                                                          |
| `this.isSpeaking()`      | `() => boolean`                              | Returns `true` if the instance is currently speaking.                                                                                                                                                                                      |
| `this.isPaused()`        | `() => boolean`                              | Returns `true` if the instance is currently paused.                                                                                                                                                                                        |
| `this.history()`         | `() => string[]`                             | Returns an `array` containing previously spoken text.                                                                                                                                                                                      |
| `this.maxHistory()`      | `(max?: number) => number`                   | Set the maximum size of the stored history. When the history reaches its maximum, the oldest entry is removed to make room for a new entry. Default is `MAX_SAFE_INTEGER`.                                                                 |
| `this.clearHistory()`    | `() => void`                                 | Empty the stored history `array`.                                                                                                                                                                                                          |

---

### TODO

- better utterance support
  - SSML markup
  - utterance queuing
  - language support
