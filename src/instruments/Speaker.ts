export default class Speaker {
  private context: any;

  constructor() {
    window.AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContext();
  }

  public play(arr: number[]) {
    const buf = new Float32Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      buf[i] = arr[i];
    }
    const buffer = this.context.createBuffer(
      1,
      buf.length,
      this.context.sampleRate,
    );
    buffer.copyToChannel(buf, 0);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(0);
  }

  get sampleRate() {
    return this.context.sampleRate;
  }
}
