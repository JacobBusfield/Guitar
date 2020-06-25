export default class Guitar {
  private _stringTension: number;
  private _characterVariation: number;
  private _stringDamping: number;
  private _stringDampingVariation: number;
  private _stringDampingCalculation: string;
  private _pluckDamping: number;
  private _pluckDampingVariation: number;
  private _body: string;
  private _stereoSpread: number;

  constructor() {
    this._stringTension = 0;
    this._characterVariation = 0;
    this._stringDamping = 0.5;
    this._stringDampingVariation = 0.25;
    this._stringDampingCalculation = 'magic';
    this._pluckDamping = 0.5;
    this._pluckDampingVariation = 0.45;
    this._body = 'simple';
    this._stereoSpread = 1;
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

  /***
   * GETTER / SETTERS
   */
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
}
