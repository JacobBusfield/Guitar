// import Audio from './Audio';

// export default class Sequencer {
//   private timeUnit: number;
//   private counter: number;
//   private startTime: number;
//   private precacheTime: number;
//   private audio: Audio;

//   constructor(audioRef: Audio) {
//     this.audio = audioRef;

//     // this was derived experimentally to match Andre Michelle's
//     // I've no idea how it works out as this...
//     // it doesn't seem to appear in the ActionScript code anywhere...
//     this.timeUnit = 0.12;

//     this.counter = 0;
//     this.startTime = 0;
//     this.precacheTime = 0.0;
//   }

//   // Create sound samples for the current part of the strum sequence,
//   // and queue generation of sound samples of the following part.
//   // The rhythms parts have as fine a granularity as possible to enable
//   // adjustment of guitar parameters with real-time feedback.
//   // (The higher strumGenerationsPerRun, the longer the delay between
//   //  parameter adjustments and samples created with the new parameters.)
//   queueStrums(chordIndex: number) {
//     var chords = [
//       YGuitar.chords.C_MAJOR,
//       YGuitar.chords.G_MAJOR,
//       YGuitar.chords.A_MINOR,
//       YGuitar.chords.E_MINOR,
//     ];

//     // TODO: put exit on here!
//     // var playState = document.getElementById("playState").value;
//     // if (playState == "stopped") {
//     // 	return;
//     // }

//     let curStrumStartTime = 0;
//     let chord = chords[chordIndex];

//     switch (this.counter % 13) {
//       case 0:
//         curStrumStartTime = this.startTime + this.timeUnit * 0;
//         guitar.strumChord(curStrumStartTime, true, 1.0, chord);
//         break;
//       case 1:
//         curStrumStartTime = this.startTime + this.timeUnit * 4;
//         guitar.strumChord(curStrumStartTime, true, 1.0, chord);
//         break;
//       case 2:
//         curStrumStartTime = this.startTime + this.timeUnit * 6;
//         guitar.strumChord(curStrumStartTime, false, 0.8, chord);
//         break;
//       case 3:
//         curStrumStartTime = this.startTime + this.timeUnit * 10;
//         guitar.strumChord(curStrumStartTime, false, 0.8, chord);
//         break;
//       case 4:
//         curStrumStartTime = this.startTime + this.timeUnit * 12;
//         guitar.strumChord(curStrumStartTime, true, 1.0, chord);
//         break;
//       case 5:
//         curStrumStartTime = this.startTime + this.timeUnit * 14;
//         guitar.strumChord(curStrumStartTime, false, 0.8, chord);
//         break;
//       case 6:
//         curStrumStartTime = this.startTime + this.timeUnit * 16;
//         guitar.strumChord(curStrumStartTime, true, 1.0, chord);
//         break;
//       case 7:
//         curStrumStartTime = this.startTime + this.timeUnit * 20;
//         guitar.strumChord(curStrumStartTime, true, 1.0, chord);
//         break;
//       case 8:
//         curStrumStartTime = this.startTime + this.timeUnit * 22;
//         guitar.strumChord(curStrumStartTime, false, 0.8, chord);
//         break;
//       case 9:
//         curStrumStartTime = this.startTime + this.timeUnit * 26;
//         guitar.strumChord(curStrumStartTime, false, 0.8, chord);
//         break;
//       case 10:
//         curStrumStartTime = this.startTime + this.timeUnit * 28;
//         guitar.strumChord(curStrumStartTime, true, 1.0, chord);
//         break;
//       case 11:
//         curStrumStartTime = this.startTime + this.timeUnit * 30;
//         guitar.strumChord(curStrumStartTime, false, 0.8, chord);
//         break;
//       case 12:
//         curStrumStartTime = this.startTime + this.timeUnit * 31;
//         guitar.strings[2].pluck(curStrumStartTime, 0.7, chord[2]);

//         curStrumStartTime = this.startTime + this.timeUnit * 31.5;
//         guitar.strings[1].pluck(curStrumStartTime, 0.7, chord[1]);

//         chordIndex = (chordIndex + 1) % 4;
//         this.startTime += this.timeUnit * 32;

//         break;
//     }
//     this.counter++;

//     // if we're only generating the next strum 200 ms ahead of the current time,
//     // we might be falling behind, so increase the precache time
//     if (curStrumStartTime - this.audio.currentTime < 0.2) {
//       this.precacheTime += 0.1;
//     }

//     //TODO: remove
//     // document.getElementById("precacheTime").innerHTML =
//     // 	precacheTime.toFixed(1) + " seconds";

//     // we try to main a constant time between when the strum
//     // has finished generated and when it actually plays
//     // the next strum will be played at curStrumStartTime; so start
//     // generating the one after the next strum at precacheTime before
//     var generateIn =
//       curStrumStartTime - this.audio.currentTime - this.precacheTime;
//     if (generateIn < 0) generateIn = 0;

//     const nextGenerationCall = () => {
//       this.queueStrums(chordIndex);
//     };
//     setTimeout(nextGenerationCall, generateIn * 1000);
//   }

//   startGuitarPlaying() {
//     this.startTime = this.audio.currentTime;
//     this.precacheTime = 0.0;
//     var startChordIndex = 0;
//     this.queueStrums(startChordIndex);
//   }
// }
