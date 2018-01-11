'use strict';

import deepFreeze from '../utils/deep_freeze';

const fs = require('fs');

export default class ContentBase {

  constructor(config) {
    this.json = (config) ?
      JSON.parse(fs.readFileSync(`${this.configDir()}/${config}`, {encoding: 'utf8'})) :
      null;
    deepFreeze(this.json);
  }

  config() {
    return this.json;
  }

  configDir() {
    return (__dirname + '/../../config');
  }

  fillingKeyRegExp() {
    return new RegExp(/^KEY__([a-zA-Z]+)$/);
  }

  buildMessage(fragments, fillings) {
    const regExp = this.fillingKeyRegExp();

    return fragments.map((v) => {
      if (regExp.test(v)) {
        return (fillings[RegExp.$1]) ? fillings[RegExp.$1] : v;
      } else {
        return v;
      }
    }).join('');
  }

  hasReply(subject) {
    return Object.keys(this.triggers()).some((key) => {
      return new RegExp(this.triggers()[key], 'i').test(subject);
    });
  }

  getReply(subject, now = new Date()) {
    const regExpFull = new RegExp(this.triggers()['full'], 'i');
    if (regExpFull.test(subject)) {
      return [{
        pos: subject.search(regExpFull),
        message: this.buildMessage(this.fragments()['full'], this.fillings(this.offsetTime(now)))
      }];
    }

    // singles
    // triggers の中に fragments_name でも入れとくか……?
    const replies = [];
    Object.keys(this.triggers()).forEach((key) => {
      // ここ、object そのものをループした方が綺麗に書けるね。 for in ?
      const regExp = new RegExp(this.triggers()[key].regexp, 'i');
      if (regExp.test(subject)) {
        replies.push({
          pos: subject.search(regExp),
          message: this.buildMessage(this.fragments()[this.triggers()[key].fragments], this.fillings(this.offsetTime(now)))
        });
      }
    });
    return replies;
  }

  getMessage(now = new Date()) {
    return [{
      pos: 0,
      message: this.buildMessage(this.fragments(), this.fillings(this.offsetTime(now)))
    }];
  }

  /*
   * Pseudo abstract methods.
   * 
   * Override these methods in chiled classes.
   */
  offsetTime(now) {
    throw new Error('Not implemented, Override is required.')
  }

  triggers() {
    throw new Error('Not implemented, Override is required.')
  }

  triggerPos(subject) {
    throw new Error('Not impmelented, Override is required.')
  }

  fragments() {
    throw new Error('Not impmelented, Override is required.')
  }

  fillings(now) {
    throw new Error('Not impmelented, Override is required.')
  }
}
