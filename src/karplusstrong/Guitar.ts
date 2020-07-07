import Audio from './Audio';
import AsmFunctionsWrapper from './ASM';

export default class Guitar {
  public get stringTension(): number {
    return this._stringTension;
  }
  public set stringTension(value: number) {
    if (value < 0) {
      this._stringTension = 0;
    } else if (value > 1) {
      this._stringTension = 1;
    } else {
      this._stringTension = value;
    }
  }

  public get characterVariation(): number {
    return this.characterVariation;
  }
  public set characterVariation(value: number) {
    if (value < 0) {
      this.characterVariation = 0;
    } else if (value > 1) {
      this.characterVariation = 1;
    } else {
      this.characterVariation = value;
    }
  }

  public get stringDamping(): number {
    return this._stringDamping;
  }
  public set stringDamping(value: number) {
    if (value < 0.1) {
      this._stringDamping = 0.1;
    } else if (value > 0.7) {
      this._stringDamping = 0.7;
    } else {
      this._stringDamping = value;
    }
  }

  public get stringDampingVariation(): number {
    return this._stringDampingVariation;
  }
  public set stringDampingVariation(value: number) {
    if (value < 0) {
      this._stringDampingVariation = 0;
    } else if (value > 0.5) {
      this._stringDampingVariation = 0.5;
    } else {
      this._stringDampingVariation = value;
    }
  }

  public get stringDampingCalculation(): string {
    return this._stringDampingCalculation;
  }
  public set stringDampingCalculation(value: string) {
    if (value === 'magic' || value === 'direct') {
      this._stringDampingCalculation = value;
    } else {
      this._stringDampingCalculation = 'magic';
    }
  }

  public get pluckDamping(): number {
    return this._pluckDamping;
  }
  public set pluckDamping(value: number) {
    if (value < 0.1) {
      this._pluckDamping = 0.1;
    } else if (value > 0.9) {
      this._pluckDamping = 0.9;
    } else {
      this._pluckDamping = value;
    }
  }

  public get pluckDampingVariation(): number {
    return this._pluckDampingVariation;
  }
  public set pluckDampingVariation(value: number) {
    if (value < 0) {
      this._pluckDampingVariation = 0;
    } else if (value > 0.5) {
      this._pluckDampingVariation = 0.5;
    } else {
      this._pluckDampingVariation = value;
    }
  }

  public get body(): string {
    return this._body;
  }
  public set body(value: string) {
    if (value === 'none' || value === 'simple') {
      this._body = value;
    } else {
      this._body = 'simple';
    }
  }

  public get stereoSpread(): number {
    return this._stereoSpread;
  }
  public set stereoSpread(value: number) {
    if (value < 0) {
      this._stereoSpread = 0;
    } else if (value > 1) {
      this._stereoSpread = 1;
    } else {
      this._stereoSpread = value;
    }
  }

  public chords: {
    C_MAJOR: number[];
    G_MAJOR: number[];
    A_MINOR: number[];
    E_MINOR: number[];
  };
  public audio: Audio;
  public strings: GuitarString[];
  private _stringTension: number;
  private _characterVariation: number;
  private _stringDamping: number;
  private _stringDampingVariation: number;
  private _stringDampingCalculation: string;
  private _pluckDamping: number;
  private _pluckDampingVariation: number;
  private _body: string;
  private _stereoSpread: number;

  constructor(audioref: Audio) {
    this._stringTension = 0;
    this._characterVariation = 0;
    this._stringDamping = 0.5;
    this._stringDampingVariation = 0.25;
    this._stringDampingCalculation = 'magic';
    this._pluckDamping = 0.5;
    this._pluckDampingVariation = 0.45;
    this._body = 'simple';
    this._stereoSpread = 1;

    // each fret represents an increase in pitch by one semitone
    // (logarithmically, one-twelth of an octave)
    // -1: don't pluck that string
    this.chords = {
      C_MAJOR: [-1, 3, 2, 0, 0, 0],
      G_MAJOR: [3, 2, 0, 0, 0, 3],
      A_MINOR: [0, 0, 2, 2, 0, 0],
      E_MINOR: [0, 2, 2, 0, 3, 0],
    };

    this.audio = audioref;

    // 'strings' becomes a 'property'
    // (an instance variable)
    this.strings = [
      // arguments are:
      // - string number
      // - octave
      // - semitone
      new GuitarString(this, 0, 2, 4),
      new GuitarString(this, 1, 2, 9),
      new GuitarString(this, 2, 3, 2),
      new GuitarString(this, 3, 3, 7),
      new GuitarString(this, 4, 3, 11),
      new GuitarString(this, 5, 4, 4), // E4
    ];
  }

  public getControlsValues() {
    return {
      stringTension: this._stringTension,
      characterVariation: this._characterVariation,
      stringDamping: this._stringDamping,
      stringDampingVariation: this._stringDampingVariation,
      stringDampingCalculation: this._stringDampingCalculation,
      pluckDamping: this._pluckDamping,
      pluckDampingVariation: this._pluckDampingVariation,
      body: this._body,
      stereoSpread: this._stereoSpread,
    };
  }

  public strumChord(
    time: number,
    downstroke: boolean,
    velocity: number,
    chord: number[],
  ) {
    let pluckOrder;
    if (downstroke === true) {
      pluckOrder = [0, 1, 2, 3, 4, 5];
    } else {
      pluckOrder = [5, 4, 3, 2, 1, 0];
    }

    for (let i = 0; i < 6; i++) {
      const stringNumber = pluckOrder[i];
      if (chord[stringNumber] !== -1) {
        this.strings[stringNumber].pluck(time, velocity, chord[stringNumber]);
      }
      time += Math.random() / 128;
    }
  }
  public setMode(mode: any) {
    for (let i = 0; i < 6; i++) {
      this.strings[i].mode = mode;
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class GuitarString {
  public mode: string;
  private guitar: Guitar;
  private basicHz: number;
  private seedNoise: Float32Array;
  private semitoneIndex: number;
  private acousticLocation: number;
  private asmWrapper: any;

  constructor(
    guitarref: Guitar,
    stringN: number,
    octave: number,
    semitone: number,
  ) {
    this.guitar = guitarref;

    // work from A0 as a reference,
    // since it has a nice round frequency
    const a0_hz = 27.5;
    // an increase in octave by 1 doubles the frequency
    // each octave is divided into 12 semitones
    // the scale goes C0, C0#, D0, D0#, E0, F0, F0#, G0, G0#, A0, A0#, B0
    // so go back 9 semitones to get to C0
    const c0_hz = a0_hz * Math.pow(2, -9 / 12);
    this.basicHz = c0_hz * Math.pow(2, octave + semitone / 12);
    // this.basicHz = this.basicHz.toFixed(2)

    const basicPeriod = 1 / this.basicHz;
    const basicPeriodSamples = Math.round(
      basicPeriod * this.guitar.audio.sampleRate,
    );
    this.seedNoise = generateSeedNoise(basicPeriodSamples);

    // this is only used in a magical calculation of filter coefficients
    this.semitoneIndex = octave * 12 + semitone - 9;

    // ranges from -1 for first string to +1 for last
    this.acousticLocation = (stringN - 2.5) * 0.4;

    this.mode = 'karplus-strong';

    this.asmWrapper = new AsmFunctionsWrapper();

    function generateSeedNoise(samples: number) {
      const noiseArray = new Float32Array(samples);
      for (let i = 0; i < samples; i++) {
        noiseArray[i] = -1 + 2 * Math.random();
      }
      return noiseArray;
    }
  }

  public pluck(startTime: any, velocity: number, tab: number) {
    // create the buffer we're going to write into
    const channels = 2;
    const sampleRate = this.guitar.audio.sampleRate;
    // 1 second buffer
    const sampleCount = 1.0 * sampleRate;
    const buffer = this.guitar.audio.createBuffer(
      channels,
      sampleCount,
      sampleRate,
    );

    const options = this.guitar.getControlsValues();
    const smoothingFactor = this.calculateSmoothingFactor(tab);
    // 'tab' represents which fret is held while plucking
    // each fret represents an increase in pitch by one semitone
    // (logarithmically, one-twelth of an octave)
    const hz = this.basicHz * Math.pow(2, tab / 12);

    // to match original ActionScript source
    velocity /= 4;

    // TODO: make this a proper enum or something
    if (this.mode === 'karplus-strong') {
      this.asmWrapper.pluck(
        buffer,
        this.seedNoise,
        sampleRate,
        hz,
        smoothingFactor,
        velocity,
        options,
        this.acousticLocation,
      );
    } else if (this.mode === 'sine') {
      const decayFactor = 8;
      this.asmWrapper.pluckDecayedSine(
        buffer,
        sampleRate,
        hz,
        velocity,
        decayFactor,
      );
    }

    // TODO: move this out into audio?
    // create an audio source node fed from the buffer we've just written
    const bufferSource = this.guitar.audio.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(this.guitar.audio.destination);

    bufferSource.start(startTime);
  }

  // calculate the constant used for the low-pass filter
  // used in the Karplus-Strong loop
  private calculateSmoothingFactor(tab: number) {
    let smoothingFactor;
    if (this.guitar.stringDampingCalculation === 'direct') {
      smoothingFactor = this.guitar.stringDamping;
    } else if (this.guitar.stringDampingCalculation === 'magic') {
      // this is copied verbatim from the flash one
      // is magical, don't know how it works
      const noteNumber = (this.semitoneIndex + tab - 19) / 44;
      smoothingFactor =
        this.guitar.stringDamping +
        Math.pow(noteNumber, 0.5) * (1 - this.guitar.stringDamping) * 0.5 +
        (1 - this.guitar.stringDamping) *
          Math.random() *
          this.guitar.stringDampingVariation;
    }
    return smoothingFactor;
  }
}
