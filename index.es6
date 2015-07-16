'use strict';

import {isString} from 'util';
import {Component, utils} from 'node-warp';
import pkg from './package.json';

export default class Ticker extends Component {
  normalizeInterval() {
    return utils.math.clamp(this.config.interval, 1, 3600 * 24 * 7)
  }

  * init() {
    this.stopped = true;
    this._counter = 0;
    this.config.interval = this.normalizeInterval();
  }

  * afterStart() {
    if (this.config.autoStart) {
      this.startTicking();
    }
  }

  * beforeDestroy() {
    this.stopTicking();
  }

  get handlers() {
    return {
      [this.config.startMsg]: this.startTicking,
      [this.config.stopMsg]: this.stopTicking,
      [this.config.setupMsg]: this.setupRequested
    };
  }

  startTicking() {
    if (this.stopped) {
      this.stopped = false;
      this.timer = setTimeout(() => { this.performTick(); }, this.config.interval * 100);
    }
  }

  performTick() {
    if (!this.stopped) {
      this.emit(this.config.event, this._counter += 1);
    }

    this.timer = setTimeout(() => {
      this.performTick();
    }, this.config.interval * 100);
  }

  stopTicking() {
    this.stopped = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setupRequested(data) {
    if (data.interval) {
      this.config.interval = data.interval;
      this.normalizeInterval();
    }
    if (isString(data.event) && data.event.length > 2) {
      this.config.event = data.event;
    }
  }
}

Ticker.id = 'ticker';
Ticker.imports = [];
Ticker.events = {
  in:  {},
  out: {}
};
Ticker.defaults = {
  name: pkg.name,
  version: pkg.version,
  desc: pkg.description,

  /** time (in 1/10th of second) between ticks */
  interval: 10,

  /** event triggered by every tick */
  event: 'ticker.tick',

  /** events to manage component properties */
  startMsg: 'ticker.start',
  stopMsg: 'ticker.stop',
  setupMsg: 'ticker.setup',
  autoStart: true
};
