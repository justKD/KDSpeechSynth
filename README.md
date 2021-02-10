# KDSpeechSynth

##### v 1.1.0 | © Cadence Holmes 2020 | MIT License

`KDSpeechSynth` is a class simplifying the use of [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).

[Fork on CodeSandbox]()

### TODO

- better utterance support
  - SSML markup
  - language support

---

## Install

`src/dist/KDSpeechSynth.bundle.js` can be added to your project in multiple ways:

```
// CommonJS / ES / Node module
// add to your module file

import { KDSpeechSynth } from "KDSpeechSynth.bundle.js";
console.log( KDSpeechSynth );
```

```
// AMD / Require module
// add to your module file

require(["KDSpeechSynth.bundle.js"], function(KDSpeechSynth) {
  console.log( KDSpeechSynth );
});
```

```
// Non-module / CDN
// add to your html file

<script src="KDSpeechSynth.bundle.js"></script>
<script>
  const KDSpeechSynth = window.kd.KDSpeechSynth;
  console.log( KDSpeechSynth );
</script>
```

## Basic Example

## Extended Example

## API
