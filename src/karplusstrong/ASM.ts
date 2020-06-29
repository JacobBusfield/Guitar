import { getNextValidFloat32HeapLength } from './Helpers';

export default class AsmFunctionsWrapper {
  private asm: any;
  private heap: Float32Array;

  constructor() {
    this.heap = new Float32Array();
  }

  public pluckDecayedSine(
    channelBuffer: { length: number; getChannelData: any },
    sampleRate: any,
    hz: any,
    velocity: any,
    decayFactor: any,
  ) {
    const requiredHeapSize = channelBuffer.length;
    if (typeof this.heap === 'undefined') {
      this.initAsm(requiredHeapSize);
    }
    if (requiredHeapSize > this.heap.length) {
      this.initAsm(requiredHeapSize);
    }

    const heapOffsets = {
      targetStart: 0,
      targetEnd: channelBuffer.length - 1,
    };

    const heapFloat32 = this.heap;
    const asm = this.asm;

    asm.renderDecayedSine(
      heapOffsets.targetStart,
      heapOffsets.targetEnd,
      sampleRate,
      hz,
      velocity,
      decayFactor,
    );

    const targetArrayL = channelBuffer.getChannelData(0);
    const targetArrayR = channelBuffer.getChannelData(1);
    for (let i = 0; i < targetArrayL.length; i++) {
      targetArrayL[i] = heapFloat32[i];
      targetArrayR[i] = heapFloat32[i];
    }
  }

  public pluck(
    channelBuffer: { length: any; getChannelData: (arg0: number) => any },
    seedNoise: string | any[],
    sampleRate: any,
    hz: any,
    smoothingFactor: any,
    velocity: any,
    options: {
      stringTension: any;
      pluckDamping: any;
      pluckDampingVariation: any;
      characterVariation: any;
      body: string;
      stereoSpread: number;
    },
    acousticLocation: number,
  ) {
    const requiredHeapSize = seedNoise.length + channelBuffer.length;
    if (typeof this.heap === 'undefined') {
      this.initAsm(requiredHeapSize);
    }
    if (requiredHeapSize > this.heap.length) {
      this.initAsm(requiredHeapSize);
    }

    const heapFloat32 = this.heap;
    const asm = this.asm;

    let i;
    for (i = 0; i < seedNoise.length; i++) {
      heapFloat32[i] = seedNoise[i];
    }

    const heapOffsets = {
      seedStart: 0,
      seedEnd: seedNoise.length - 1,
      targetStart: seedNoise.length,
      targetEnd: seedNoise.length + channelBuffer.length - 1,
    };

    asm.renderKarplusStrong(
      heapOffsets.seedStart,
      heapOffsets.seedEnd,
      heapOffsets.targetStart,
      heapOffsets.targetEnd,
      sampleRate,
      hz,
      velocity,
      smoothingFactor,
      options.stringTension,
      options.pluckDamping,
      options.pluckDampingVariation,
      options.characterVariation,
    );

    if (options.body === 'simple') {
      asm.resonate(heapOffsets.targetStart, heapOffsets.targetEnd);
    }

    asm.fadeTails(
      heapOffsets.targetStart,
      heapOffsets.targetEnd - heapOffsets.targetStart + 1,
    );

    const targetArrayL = channelBuffer.getChannelData(0);
    const targetArrayR = channelBuffer.getChannelData(1);
    // string.acousticLocation is set individually for each string such that
    // the lowest note has a value of -1 and the highest +1
    const stereoSpread = options.stereoSpread * acousticLocation;
    // for negative stereoSpreads, the note is pushed to the left
    // for positive stereoSpreads, the note is pushed to the right
    const gainL = (1 - stereoSpread) * 0.5;
    const gainR = (1 + stereoSpread) * 0.5;
    for (i = 0; i < targetArrayL.length; i++) {
      targetArrayL[i] = heapFloat32[heapOffsets.targetStart + i] * gainL;
    }
    for (i = 0; i < targetArrayL.length; i++) {
      targetArrayR[i] = heapFloat32[heapOffsets.targetStart + i] * gainR;
    }
  }

  // TODO: need init moving to constructor
  private initAsm(heapSize: any) {
    // http://asmjs.org/spec/latest/#modules
    // the byte length must be 2^n for n in [12, 24],
    // or for bigger heaps, 2^24 * n for n >= 1
    const roundedHeapSize = getNextValidFloat32HeapLength(heapSize);

    // asm.js requires all data in/out of function to
    // be done through heap object
    // we don't want to allocate a new heap on every call,
    // so we reuse a static variable
    // but seedNoise.length will be different depending on the string,
    // so be willing to enlarge it if necessary
    this.heap = new Float32Array(roundedHeapSize);

    // from the asm.js spec, it sounds like the heap must be
    // passed in as a plain ArrayBuffer
    // (.buffer is the ArrayBuffer referenced by the Float32Buffer)
    const heapBuffer = this.heap.buffer;
    // any non-asm.js functions must be referenced through a
    // "foreign function" interface
    const foreignFunctions = {
      random: Math.random,
      round: Math.round,
    };
    // we specifically do this here so that we only recreate
    // the asm functions if we really have to
    // that way, V8 will be able to cache optimized versions
    // of the functions
    this.asm = asmFunctions(window, foreignFunctions, heapBuffer);
  }
}

// standard asm.js block
// stdlib: object through which standard library functions are called
// foreign: object through which external javascript functions are called
// heap: buffer used for all data in/out of function
function asmFunctions(
  stdlib: Window & typeof globalThis,
  foreign: { random: any; round: any },
  heapBuffer: any,
) {
  'use asm';

  // heap is supposed to come in as just an ArrayBuffer
  // so first need to get a Float32 view of it
  const heap = new stdlib.Float32Array(heapBuffer);
  const fround = stdlib.Math.fround;
  const sin = stdlib.Math.sin;
  const pi = stdlib.Math.PI;
  const floor = stdlib.Math.floor;
  const pow = stdlib.Math.pow;
  const random = foreign.random;
  const round = foreign.round;

  // simple discrete-time low-pass filter from Wikipedia
  function lowPass(
    lastOutput: number,
    currentInput: number,
    smoothingFactor: number,
  ) {
    // coersion to indicate type of arguments
    // +x represents double
    // we do all the arithmetic using doubles rather than floats,
    // because in the asm.js spec, operations done floats resolve
    // to 'floatish'es, which need to be coerced back into floats,
    // and the code becomes unreadable
    lastOutput = +lastOutput;
    currentInput = +currentInput;
    smoothingFactor = +smoothingFactor;

    let currentOutput = 0.0;
    currentOutput =
      smoothingFactor * currentInput + (1.0 - smoothingFactor) * lastOutput;

    return +currentOutput;
  }

  // simple discrete-time high-pass filter from Wikipedia
  function highPass(
    lastOutput: number,
    lastInput: number,
    currentInput: number,
    smoothingFactor: number,
  ) {
    lastOutput = +lastOutput;
    lastInput = +lastInput;
    currentInput = +currentInput;
    smoothingFactor = +smoothingFactor;

    let currentOutput = 0.0;
    currentOutput =
      smoothingFactor * lastOutput +
      smoothingFactor * (currentInput - lastInput);

    return +currentOutput;
  }

  // this is copied verbatim from the original ActionScript source
  // haven't figured out how it works yet
  function resonate(heapStart: number, heapEnd: number) {
    // '|0' declares parameter as int
    // http://asmjs.org/spec/latest/#parameter-type-annotations
    heapStart = heapStart | 0;
    heapEnd = heapEnd | 0;

    // explicitly initialise all variables so types are declared
    let r00 = 0.0;
    let f00 = 0.0;
    let r10 = 0.0;
    let f10 = 0.0;
    let f0 = 0.0;
    let c0 = 0.0;
    let c1 = 0.0;
    let r0 = 0.0;
    let r1 = 0.0;
    let i = 0;
    let resonatedSample = 0.0;
    let resonatedSamplePostHighPass = 0.0;
    // by making the smoothing factor large, we make the cutoff
    // frequency very low, acting as just an offset remover
    const highPassSmoothingFactor = 0.999;
    let lastOutput = 0.0;
    let lastInput = 0.0;

    // +x indicates that x is a double
    // (asm.js Math functions take doubles as arguments)
    c0 = 2.0 * sin((pi * 3.4375) / 44100.0);
    c1 = 2.0 * sin((pi * 6.124928687214833) / 44100.0);
    r0 = 0.98;
    r1 = 0.98;

    // asm.js seems to require byte addressing of the heap...?
    // http://asmjs.org/spec/latest/#validateheapaccess-e
    // yeah, when accessing the heap with an index which is an expression,
    // the total index expression is validated in a way that
    // forces the index to be a byte
    // and apparently '|0' coerces to signed when not in the context
    // of parameters
    // http://asmjs.org/spec/latest/#binary-operators
    for (i = heapStart << 2; (i | 0) <= heapEnd << 2; i = (i + 4) | 0) {
      r00 = r00 * r0;
      r00 = r00 + (f0 - f00) * c0;
      f00 = f00 + r00;
      f00 = f00 - f00 * f00 * f00 * 0.166666666666666;
      r10 = r10 * r1;
      r10 = r10 + (f0 - f10) * c1;
      f10 = f10 + r10;
      f10 = f10 - f10 * f10 * f10 * 0.166666666666666;
      f0 = +heap[i >> 2];
      resonatedSample = f0 + (f00 + f10) * 2.0;

      // I'm not sure why, but the resonating process plays
      // havok with the DC offset - it jumps around everywhere.
      // We put it back to zero DC offset by adding a high-pass
      // filter with a super low cutoff frequency.
      resonatedSamplePostHighPass = +highPass(
        lastOutput,
        lastInput,
        resonatedSample,
        highPassSmoothingFactor,
      );
      heap[i >> 2] = resonatedSamplePostHighPass;

      lastOutput = resonatedSamplePostHighPass;
      lastInput = resonatedSample;
    }
  }

  // apply a fade envelope to the end of a buffer
  // to make it end at zero ampltiude
  // (to avoid clicks heard when sample otherwise suddenly
  //  cuts off)
  function fadeTails(heapStart: number, length: number) {
    heapStart = heapStart | 0;
    length = length | 0;

    let heapEnd = 0;
    let tailProportion = 0.0;
    let tailSamples = 0;
    let tailSamplesStart = 0;
    let i = 0;
    let samplesThroughTail = 0;
    let proportionThroughTail = 0.0;
    let gain = 0.0;

    tailProportion = 0.1;
    // we first convert length from an int to an unsigned (>>>0)
    // so that we can convert it a double for the argument of floor()
    // then convert it to a double (+)
    // then convert the double result of floor to a signed with ~~
    // http://asmjs.org/spec/latest/#binary-operators
    // http://asmjs.org/spec/latest/#standard-library
    // http://asmjs.org/spec/latest/#binary-operators
    tailSamples = ~~floor(+(length >>> 0) * tailProportion);
    // http://asmjs.org/spec/latest/#additiveexpression
    // the result of an additive addition is an intish,
    // which must be coerced back to an int
    tailSamplesStart = (heapStart + length - tailSamples) | 0;

    heapEnd = (heapStart + length) | 0;

    // so remember, i represents a byte index,
    // and the heap is a Float32Array (4 bytes)
    for (
      i = tailSamplesStart << 2, samplesThroughTail = 0;
      (i | 0) < heapEnd << 2;
      i = (i + 4) | 0, samplesThroughTail = (samplesThroughTail + 1) | 0
    ) {
      proportionThroughTail =
        +(samplesThroughTail >>> 0) / +(tailSamples >>> 0);
      gain = 1.0 - proportionThroughTail;
      heap[i >> 2] = heap[i >> 2] * fround(gain);
    }
  }

  // the "smoothing factor" parameter is the coefficient
  // used on the terms in the main low-pass filter in the
  // Karplus-Strong loop
  function renderKarplusStrong(
    seedNoiseStart: number,
    seedNoiseEnd: number,
    targetArrayStart: number,
    targetArrayEnd: number,
    sampleRate: number,
    hz: number,
    velocity: number,
    smoothingFactor: number,
    stringTension: number,
    pluckDamping: number,
    pluckDampingVariation: number,
    characterVariation: number,
  ) {
    seedNoiseStart = seedNoiseStart | 0;
    seedNoiseEnd = seedNoiseEnd | 0;
    targetArrayStart = targetArrayStart | 0;
    targetArrayEnd = targetArrayEnd | 0;
    sampleRate = sampleRate | 0;
    hz = +hz;
    velocity = +velocity;
    smoothingFactor = +smoothingFactor;
    stringTension = +stringTension;
    pluckDamping = +pluckDamping;
    pluckDampingVariation = +pluckDampingVariation;
    characterVariation = +characterVariation;

    let period = 0.0;
    let periodSamples = 0;
    let sampleCount = 0;
    let lastOutputSample = 0.0;
    let curInputSample = 0.0;
    let noiseSample = 0.0;
    let skipSamplesFromTension = 0;
    let curOutputSample = 0.0;
    let pluckDampingMin = 0.0;
    let pluckDampingMax = 0.0;
    let pluckDampingVariationMin = 0.0;
    let pluckDampingVariationMax = 0.0;
    let pluckDampingVariationDifference = 0.0;
    let pluckDampingCoefficient = 0.0;

    // the (byte-addressed) index of the heap as a whole that
    // we get noise samples from
    let heapNoiseIndexBytes = 0;
    // the (Float32-addressed) index of the portion of the heap
    // that we'll be writing to
    let targetIndex = 0;
    // the (byte-addressed) index of the heap as a whole where
    // we'll be writing
    let heapTargetIndexBytes = 0;
    // the (byte-addressed) index of the heap as a whole of
    // the start of the last period of samples
    let lastPeriodStartIndexBytes = 0;
    // the (byte-addressed) index of the heap as a whole from
    // where we'll be taking samples from the last period, after
    // having added the skip from tension
    let lastPeriodInputIndexBytes = 0;

    period = 1.0 / hz;
    periodSamples = ~~+round(period * +(sampleRate >>> 0));
    sampleCount = (targetArrayEnd - targetArrayStart + 1) | 0;

    /*
		|- pluckDampingMax
		|
		|               | - pluckDampingVariationMax         | -
		|               | (pluckDampingMax - pluckDamping) * |
		|               | pluckDampingVariation              | pluckDamping
		|- pluckDamping | -                                  | Variation
		|               | (pluckDamping - pluckDampingMin) * | Difference
		|               | pluckDampingVariation              |
		|               | - pluckDampingVariationMin         | -
		|
		|- pluckDampingMin
		*/
    pluckDampingMin = 0.1;
    pluckDampingMax = 0.9;
    pluckDampingVariationMin =
      pluckDamping - (pluckDamping - pluckDampingMin) * pluckDampingVariation;
    pluckDampingVariationMax =
      pluckDamping + (pluckDampingMax - pluckDamping) * pluckDampingVariation;
    pluckDampingVariationDifference =
      pluckDampingVariationMax - pluckDampingVariationMin;
    pluckDampingCoefficient =
      pluckDampingVariationMin + +random() * pluckDampingVariationDifference;

    for (
      targetIndex = 0;
      (targetIndex | 0) < (sampleCount | 0);
      targetIndex = (targetIndex + 1) | 0
    ) {
      heapTargetIndexBytes = (targetArrayStart + targetIndex) << 2;

      if ((targetIndex | 0) < (periodSamples | 0)) {
        // for the first period, feed in noise
        // remember, heap index has to be bytes...
        heapNoiseIndexBytes = (seedNoiseStart + targetIndex) << 2;
        noiseSample = +heap[heapNoiseIndexBytes >> 2];
        // create room for character variation noise
        noiseSample = noiseSample * (1.0 - characterVariation);
        // add character variation
        noiseSample =
          noiseSample + characterVariation * (-1.0 + 2.0 * +random());
        // also velocity
        noiseSample = noiseSample * velocity;
        // by varying 'pluck damping', we can control the spectral
        // content of the input noise
        curInputSample = +lowPass(
          curInputSample,
          noiseSample,
          pluckDampingCoefficient,
        );
      } else if (stringTension !== 1.0) {
        // for subsequent periods, feed in the output from
        // about one period ago
        lastPeriodStartIndexBytes =
          (heapTargetIndexBytes - (periodSamples << 2)) | 0;
        skipSamplesFromTension = ~~floor(
          stringTension * +(periodSamples >>> 0),
        );
        lastPeriodInputIndexBytes =
          (lastPeriodStartIndexBytes + (skipSamplesFromTension << 2)) | 0;
        curInputSample = +heap[lastPeriodInputIndexBytes >> 2];
      } else {
        // if stringTension == 1.0, we would be reading from the
        // same sample we were writing to
        // ordinarily, this would have the effect that only the first
        // period of noise was preserved, and the rest of the buffer
        // would be silence, but because we're reusing the heap,
        // we'd actually be reading samples from old waves
        curInputSample = 0.0;
      }

      // the current period is generated by applying a low-pass
      // filter to the last period
      curOutputSample = +lowPass(
        lastOutputSample,
        curInputSample,
        smoothingFactor,
      );

      heap[heapTargetIndexBytes >> 2] = curOutputSample;
      lastOutputSample = curOutputSample;
    }
  }

  function renderDecayedSine(
    targetArrayStart: number,
    targetArrayEnd: number,
    sampleRate: number,
    hz: number,
    velocity: number,
    decayFactor: number,
  ) {
    targetArrayStart = targetArrayStart | 0;
    targetArrayEnd = targetArrayEnd | 0;
    sampleRate = sampleRate | 0;
    hz = +hz;
    velocity = +velocity;
    decayFactor = +decayFactor;

    let sampleCount = 0;
    // the (Float32-addressed) index of the portion of the heap
    // that we'll be writing to
    let targetIndex = 0;
    // the (byte-addressed) index of the heap as a whole where
    // we'll be writing
    let heapTargetIndexBytes = 0;

    let time = 0.0;

    sampleCount = (targetArrayEnd - targetArrayStart + 1) | 0;

    for (
      targetIndex = 0;
      (targetIndex | 0) < (sampleCount | 0);
      targetIndex = (targetIndex + 1) | 0
    ) {
      heapTargetIndexBytes = (targetArrayStart + targetIndex) << 2;

      // >>>0: convert from int to unsigned
      time = +(targetIndex >>> 0) / +(sampleRate >>> 0);
      heap[heapTargetIndexBytes >> 2] =
        velocity * pow(2.0, -decayFactor * time) * sin(2.0 * pi * hz * time);
    }
  }

  return {
    renderKarplusStrong,
    renderDecayedSine,
    fadeTails,
    resonate,
  };
}
