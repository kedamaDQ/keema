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

  buildMessage(now, templateKey = null, fillingsKey = null) {
    const regExp = this.fillingKeyRegExp();
    const template = this.getTemplate(now, templateKey);
    const fillings = this.getFillings(now, fillingsKey);

    return template.fragments.map((v) => {
      if (regExp.test(v)) {
        return (fillings[RegExp.$1]) ? fillings[RegExp.$1] : v;
      } else {
        return v;
      }
    }).join('');
  }

  hasReply(subject) {
    const types = this.getMessageTypes();
    return Object.keys(types).some((t) => {
      return new RegExp(types[t].regexp, 'i').test(subject);
    });
  }

  getReply(subject, now = new Date()) {
    const types = this.getMessageTypes();
    const regExpFull = new RegExp(types[KEY_FULL].regexp, 'i');
    if (regExpFull.test(subject)) {
      return [{
        pos: subject.search(regExpFull),
        message: this.buildMessage(now, types[KEY_FULL].template_key, types[KEY_FULL].fillings_key)
      }]
    }

    const replies = [];
    for (const t in types) {
      if (!types[t].regexp) {
        continue;
      }

      const regExp = new RegExp(types[t].regexp, 'i');
      if (regExp.test(subject)) {
        replies.push({
          pos: subject.search(regExp),
          message: this.buildMessage(now, types[t].template_key, types[t].fillings_key)
        });
      }
    };
    return replies;
  }

  getMessage(now = new Date()) {
    const type = this.getMessageTypes()[KEY_PERIODIC];
    return [{
      pos: 0,
      message: this.buildMessage(now, type.template_key, type.fillings_key)
    }];
  }

  /*
   * Pseudo abstract methods.
   * 
   * Override these methods in chiled classes.
   */
  getMessageTypes() {
    throw new Error('Not implemented, Override is required.')
  }

  getTemplates(now, templateKey) {
    throw new Error('Not impmelented, Override is required.')
  }

  getFillings(now, fillingsKey) {
    throw new Error('Not impmelented, Override is required.')
  }
}
