import _Guitar from './Guitar.ts'
import _Audio from './Audio.ts'


var Audio = new _Audio()
var guitar = new _Guitar(Audio)


function toggleGuitarPlaying() {
	//TODO: fix
	startGuitarPlaying();
}

function updateStringDamping(value) {
	guitar.stringDamping = value
}

function updateStringDampingVariation(value) {
	guitar.stringDampingVariation = value
}

function updateStringDampingCalculation(value) {
	guitar.stringDampingCalculation = value
}

function updateStringTension(value) {
	guitar.stringTension = value
}

function updateCharacterVariation(value) {
	guitar.stringCharacterVariation = value
}

function updateStereoSpread(value) {
	guitar.stereoSpread = value
}

function updatePluckDamping(value) {
	guitar.stringPluckDamping = value;
}

function updatePluckDampingVariation(value) {
	guitar.stringPluckDampingVariation = value
}

function updateBody(value) {
	guitar.body = value
}

// this was derived experimentally to match Andre Michelle's
// I've no idea how it works out as this...
// it doesn't seem to appear in the ActionScript code anywhere...
var timeUnit = 0.12;

// Create sound samples for the current part of the strum sequence,
// and queue generation of sound samples of the following part.
// The rhythms parts have as fine a granularity as possible to enable
// adjustment of guitar parameters with real-time feedback.
// (The higher strumGenerationsPerRun, the longer the delay between
//  parameter adjustments and samples created with the new parameters.)
function queueStrums(sequenceN, blockStartTime, chordIndex, precacheTime) {
	var chords = [
		guitar.chords.C_MAJOR,
		guitar.chords.G_MAJOR,
		guitar.chords.A_MINOR,
		guitar.chords.E_MINOR
	];

	// TODO: put exit on here!
	// var playState = document.getElementById("playState").value;
	// if (playState == "stopped") {
	// 	return;
	// }

	var curStrumStartTime;

	var chord = chords[chordIndex];
	switch (sequenceN % 13) {
		case 0:
			curStrumStartTime = blockStartTime + timeUnit * 0;
			guitar.strumChord(curStrumStartTime, true, 1.0, chord);
			break;
		case 1:
			curStrumStartTime = blockStartTime + timeUnit * 4;
			guitar.strumChord(curStrumStartTime, true, 1.0, chord);
			break;
		case 2:
			curStrumStartTime = blockStartTime + timeUnit * 6;
			guitar.strumChord(curStrumStartTime, false, 0.8, chord);
			break;
		case 3:
			curStrumStartTime = blockStartTime + timeUnit * 10;
			guitar.strumChord(curStrumStartTime, false, 0.8, chord);
			break;
		case 4:
			curStrumStartTime = blockStartTime + timeUnit * 12;
			guitar.strumChord(curStrumStartTime, true, 1.0, chord);
			break;
		case 5:
			curStrumStartTime = blockStartTime + timeUnit * 14;
			guitar.strumChord(curStrumStartTime, false, 0.8, chord);
			break;
		case 6:
			curStrumStartTime = blockStartTime + timeUnit * 16;
			guitar.strumChord(curStrumStartTime, true, 1.0, chord);
			break;
		case 7:
			curStrumStartTime = blockStartTime + timeUnit * 20;
			guitar.strumChord(curStrumStartTime, true, 1.0, chord);
			break;
		case 8:
			curStrumStartTime = blockStartTime + timeUnit * 22;
			guitar.strumChord(curStrumStartTime, false, 0.8, chord);
			break;
		case 9:
			curStrumStartTime = blockStartTime + timeUnit * 26;
			guitar.strumChord(curStrumStartTime, false, 0.8, chord);
			break;
		case 10:
			curStrumStartTime = blockStartTime + timeUnit * 28;
			guitar.strumChord(curStrumStartTime, true, 1.0, chord);
			break;
		case 11:
			curStrumStartTime = blockStartTime + timeUnit * 30;
			guitar.strumChord(curStrumStartTime, false, 0.8, chord);
			break;
		case 12:

			curStrumStartTime = blockStartTime + timeUnit * 31;
			guitar.strings[2].pluck(curStrumStartTime, 0.7, chord[2]);

			curStrumStartTime = blockStartTime + timeUnit * 31.5;
			guitar.strings[1].pluck(curStrumStartTime, 0.7, chord[1]);

			chordIndex = (chordIndex + 1) % 4;
			blockStartTime += timeUnit * 32;

			break;
	}
	sequenceN++;

	// if we're only generating the next strum 200 ms ahead of the current time,
	// we might be falling behind, so increase the precache time
	if (curStrumStartTime - Audio.currentTime < 0.2) {
		precacheTime += 0.1;
	}

	// we try to main a constant time between when the strum
	// has finished generated and when it actually plays
	// the next strum will be played at curStrumStartTime; so start
	// generating the one after the next strum at precacheTime before
	var generateIn = curStrumStartTime - Audio.currentTime - precacheTime;
	if (generateIn < 0)
		generateIn = 0;

	const nextGenerationCall = function () {
		queueStrums(sequenceN, blockStartTime, chordIndex, precacheTime);
	};
	setTimeout(nextGenerationCall, generateIn * 1000);
}

function startGuitarPlaying() {
	var startSequenceN = 0;
	var blockStartTime = Audio.currentTime;
	var startChordIndex = 0;
	var precacheTime = 0.0;
	queueStrums(startSequenceN, blockStartTime, startChordIndex, precacheTime);
}


export {
	toggleGuitarPlaying,
	updateStringDamping,
	updateStringDampingVariation,
	updateStringDampingCalculation,
	updateStringTension,
	updateCharacterVariation,
	updateStereoSpread,
	updatePluckDamping,
	updatePluckDampingVariation,
	updateBody
}