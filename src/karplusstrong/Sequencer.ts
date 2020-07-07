import Audio from './Audio';
import Guitar from './Guitar';

export default class Sequencer {
  private timeUnit: number;
  private audio: Audio;
  private guitar: Guitar;
  private isPlaying: boolean;

  constructor(audioRef: Audio, guitarRef: Guitar) {
    this.audio = audioRef;
    this.guitar = guitarRef;

    // this was derived experimentally to match Andre Michelle's
    // I've no idea how it works out as this...
    // it doesn't seem to appear in the ActionScript code anywhere...
    this.timeUnit = 0.12;

    this.isPlaying = false;
  }

  public startGuitarPlaying() {
    this.isPlaying = true;
    const startSequenceN = 0;
    const blockStartTime = this.audio.currentTime;
    const startChordIndex = 0;
    const precacheTime = 0.0;
    this.queueStrums(
      startSequenceN,
      blockStartTime,
      startChordIndex,
      precacheTime,
    );
  }

  public stopGuitarPlaying() {
    this.isPlaying = false;
  }

  // Create sound samples for the current part of the strum sequence,
  // and queue generation of sound samples of the following part.
  // The rhythms parts have as fine a granularity as possible to enable
  // adjustment of guitar parameters with real-time feedback.
  // (The higher strumGenerationsPerRun, the longer the delay between
  //  parameter adjustments and samples created with the new parameters.)
  private queueStrums(
    sequenceN: number,
    blockStartTime: number,
    chordIndex: number,
    precacheTime: number,
  ) {
    const chords = [
      this.guitar.chords.C_MAJOR,
      this.guitar.chords.G_MAJOR,
      this.guitar.chords.A_MINOR,
      this.guitar.chords.E_MINOR,
    ];

    if (!this.isPlaying) {
      return;
    }

    let curStrumStartTime = 0;

    const chord = chords[chordIndex];
    switch (sequenceN % 13) {
      case 0:
        curStrumStartTime = blockStartTime + this.timeUnit * 0;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 1:
        curStrumStartTime = blockStartTime + this.timeUnit * 4;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 2:
        curStrumStartTime = blockStartTime + this.timeUnit * 6;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 3:
        curStrumStartTime = blockStartTime + this.timeUnit * 10;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 4:
        curStrumStartTime = blockStartTime + this.timeUnit * 12;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 5:
        curStrumStartTime = blockStartTime + this.timeUnit * 14;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 6:
        curStrumStartTime = blockStartTime + this.timeUnit * 16;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 7:
        curStrumStartTime = blockStartTime + this.timeUnit * 20;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 8:
        curStrumStartTime = blockStartTime + this.timeUnit * 22;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 9:
        curStrumStartTime = blockStartTime + this.timeUnit * 26;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 10:
        curStrumStartTime = blockStartTime + this.timeUnit * 28;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 11:
        curStrumStartTime = blockStartTime + this.timeUnit * 30;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 12:
        curStrumStartTime = blockStartTime + this.timeUnit * 31;
        this.guitar.strings[2].pluck(curStrumStartTime, 0.7, chord[2]);

        curStrumStartTime = blockStartTime + this.timeUnit * 31.5;
        this.guitar.strings[1].pluck(curStrumStartTime, 0.7, chord[1]);

        chordIndex = (chordIndex + 1) % 4;
        blockStartTime += this.timeUnit * 32;

        break;
    }
    sequenceN++;

    // if we're only generating the next strum 200 ms ahead of the current time,
    // we might be falling behind, so increase the precache time
    if (curStrumStartTime - this.audio.currentTime < 0.2) {
      precacheTime += 0.1;
    }

    // we try to main a constant time between when the strum
    // has finished generated and when it actually plays
    // the next strum will be played at curStrumStartTime; so start
    // generating the one after the next strum at precacheTime before
    let generateIn = curStrumStartTime - this.audio.currentTime - precacheTime;
    if (generateIn < 0) {
      generateIn = 0;
    }

    const nextGenerationCall = () => {
      this.queueStrums(sequenceN, blockStartTime, chordIndex, precacheTime);
    };
    setTimeout(nextGenerationCall, generateIn * 1000);
  }
}
