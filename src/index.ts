import { SpeechSynth } from "./SpeechSynth";

/*
export type KDSpeechSynthParams = {
  voice?: number;
  text?: string;
  rate?: number; // 0.1 - 10
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
  maxHistory?: number;
  onReady?: () => {};
  onSpeakStart?: (e: any) => void;
  onSpeakEnd?: (e: any) => void;
  onError?: (e: any) => void;
  onPause?: (e: any) => void;
  onResume?: (e: any) => void;
  onMark?: (e: any) => void;
  onBoundary?: (e: any) => void;
  onVoicesChanged?: (e: any) => void;
};
*/

const synth = new SpeechSynth({
  text: "text",
  voice: 38,
  rate: 0.75,
  pitch: 0.5,
  onSpeakStart: (e: any) => console.log("start"),
  onSpeakEnd: (e: any) => console.log("end"),
});

document.getElementsByTagName("button")[0].onclick = () => {
  synth.speak();
};
