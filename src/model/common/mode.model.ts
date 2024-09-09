import logger from './../../config/logger';

class Mode {
  private _name: string;
  constructor() {
    this._name = '침실';
  }

  public set name(v: string) {
    logger.info('change mode ' + this._name + ' -> ' + v);
    this._name = v;
  }

  public get name(): string {
    return this._name;
  }
}

export default { mode: new Mode() };
