// enum GuitarState {
//   STOPPED = 0,
//   PLAYING = 1,
// }

import Speaker from './Speaker';

export default class Guitar {
  // private state: GuitarState;
  private speaker: Speaker;

  constructor() {
    this.speaker = new Speaker();
  }

  public play() {
    // this.state = GuitarState.PLAYING;

    const sineWaveAt = (sampleNumber: number, toneNumber: number) => {
      const sampleFreq = this.speaker.sampleRate / toneNumber;
      return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)));
    };

    const arr = [];
    const volume = 0.2;
    const seconds = 0.5;
    const tone = 441;

    for (let i = 0; i < this.speaker.sampleRate * seconds; i++) {
      arr[i] = sineWaveAt(i, tone) * volume;
    }

    this.speaker.play(arr);
  }
}
