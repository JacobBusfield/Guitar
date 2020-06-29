export default class Audio {
  private context: any;

  constructor() {
    if ('localAudioContext' in window) {
      this.context = (window as any).localAudioContext;
      return;
      // return window.localAudioContext;
    }

    let constructor;
    if ('AudioContext' in window) {
      // Firefox, Chrome
      constructor = window.AudioContext;
    } else if ('webkitAudioContext' in window) {
      // Safari
      constructor = (window as any).webkitAudioContext;
    } else {
      // TODO: handle error.
      return;
    }

    this.context = new constructor();
    (window as any).localAudioContext = this.context;
  }

  get destination() {
    return this.context.destination;
  }

  get sampleRate() {
    return this.context.sampleRate;
  }

  get currentTime() {
    return this.context.currentTime;
  }

  // TODO: you can get most of this from inside the class?
  public createBuffer(
    channels: number,
    sampleCount: number,
    sampleRate: number,
  ) {
    return this.context.createBuffer(channels, sampleCount, sampleRate);
  }

  public createBufferSource() {
    return this.context.createBufferSource();
  }
}
