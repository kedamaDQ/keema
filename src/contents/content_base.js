'use strict';

import deepFreeze from '../utils/deep_freeze';

export const KEY_FULL = 'full';
export const KEY_PERIODIC = 'periodic';

const fs = require('fs');

export default class ContentBase {

  constructor(config) {
    this.json = (config) ?
      JSON.parse(fs.readFileSync(`${this.configDir()}/${config}`, {encoding: 'utf8'})) :
      null;
    deepFreeze(this.json);
  }

  config() {
    return Object.assign({}, this.json);
  }

  configDir() {
    return (__dirname + '/../../config');
  }

  fillingKeyRegExp() {
    return new RegExp(/^KEY__([a-zA-Z]+)$/);
  }

  buildMessage(now, prop) {
    const regExp = this.fillingKeyRegExp();
    const template = this.getTemplate(now, prop);
    const fillings = this.getFillings(now, prop);

    if (!(template && fillings)) {
      return null;
    }

    return template.fragments.map((v) => {
      if (regExp.test(v)) {
        return (fillings[RegExp.$1]) ? fillings[RegExp.$1] : v;
      } else {
        return v;
      }
    }).join('');
  }

  hasReply(subject) {
    const props = this.getMessageProps();
    return Object.keys(props).some((key) => {
      return new RegExp(props[key].regexp, 'i').test(subject);
    });
  }

  getReply(subject, now = new Date()) {
    const props = this.getMessageProps();
    const regExpFull = new RegExp(props[KEY_FULL].regexp, 'i');
    if (regExpFull.test(subject)) {
      return [{
        pos: subject.search(regExpFull),
        message: this.buildMessage(now, props[KEY_FULL])
      }].filter((v) => v.message);
    }

    const replies = [];
    for (const key in props) {
      if (!props[key].regexp) {
        continue;
      }

      const regExp = new RegExp(props[key].regexp, 'i');
      if (regExp.test(subject)) {
        replies.push({
          pos: subject.search(regExp),
          message: this.buildMessage(now, props[key])
        });
      }
    };
    return replies.filter((v) => v.message);
  }

  getMessage(now = new Date()) {
    const messages = [];
    this.getMessageProps()[KEY_PERIODIC].forEach((prop) => {
      messages.push({
        pos: 0,
        message: this.buildMessage(now, prop)
      });
    });
    return messages.filter((v) => v.message);
  }

  /*
   * Pseudo abstract methods.
   * 
   * Override these methods in chiled classes.
   */
  getMessageProps() {
    throw new Error('Not implemented, Override is required.')
  }

  getTemplate(now, messageProps) {
    throw new Error('Not impmelented, Override is required.')
  }

  getFillings(now, messageProps) {
    throw new Error('Not impmelented, Override is required.')
  }
}
