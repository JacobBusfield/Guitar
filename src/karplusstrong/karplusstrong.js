import _Guitar from './Guitar.ts'
import _Sequencer from './Sequencer.ts'
import _Audio from './Audio.ts'


var audio = new _Audio()
var guitar = new _Guitar(audio)
var sequencer = new _Sequencer(audio, guitar)


function startGuitarPlaying() {
	sequencer.startGuitarPlaying()
}

function stopGuitarPlaying() {
	sequencer.stopGuitarPlaying()
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


export {
	startGuitarPlaying,
	stopGuitarPlaying,
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