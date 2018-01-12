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
    return {...this.json};
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
    const offsettedNow = this.offsetTime(now);

    if (regExpFull.test(subject)) {
      return [{
        pos: subject.search(regExpFull),
        message: this.buildMessage(
          // palace_of_devils cannot work.
          // separate out into message_type & reply_type?
          this.replyFragments(offsettedNow, 'full'),
          this.fillings(offsettedNow, 'full')
        )
      }];
    }

    const replies = [];
    for (const key in this.triggers()) {
      const trigger = this.triggers[key];
      const regExp = new RegExp(trigger.regexp, 'i');
      if (regExp.test(subject)) {
        replies.push({
          pos: subject.search(regExp),
          message: this.buildMessage(
            this.replyFragments(offsettedNow, trigger.fragments),
            this.fillings(offsettedNow, trigger.fragments)
          )
        });
      }
    };
    return replies;
  }

  getMessage(now = new Date()) {
    const offsettedNow = this.offsetTime(now);
    return [{
      pos: 0,
      message: this.buildMessage(
        this.messageFragments(offsettedNow, 'full'),
        this.fillings(offsettedNow, 'full')
      )
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

  replyFragments() {
    throw new Error('Not impmelented, Override is required.')
  }

  messageFragments() {
    throw new Error('Not impmelented, Override is required.')
  }

  fillings(now) {
    throw new Error('Not impmelented, Override is required.')
  }
}
