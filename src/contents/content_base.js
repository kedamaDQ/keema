'use strict';

import deepFreeze from '../utils/deep_freeze';

export const KEY_FULL = 'full';
export const KEY_PERIODIC = 'periodic';
export const WHEN_TODAY = 'today';
export const WHEN_TOMORROW = 'tomorrow';
export const REGEXP_TODAY = new RegExp(/(?:今日|本日|現在|今|きょう|ほんじつ|げんざい|いま|トゥデ[イィ]|とぅで[いぃ]|ナ[ウゥ]|な[うぅ])の/);
export const REGEXP_TOMORROW = new RegExp(/(?:明日|あした|トゥモロ[ーウゥ]|とぅもろ[ーうぅ])[のズ]/);
export const STRING_TODAY = '本日';
export const STRING_TOMORROW = '明日';

const fs = require('fs');

export default class ContentBase {

  constructor(config) {
    this.json = (config) ?
      JSON.parse(fs.readFileSync(`${this.configDir()}/${config}`, {encoding: 'utf8'})) :
      null;
    this.whenStrings = {};
    this.whenStrings[WHEN_TODAY] = STRING_TODAY;
    this.whenStrings[WHEN_TOMORROW] = STRING_TOMORROW;
    deepFreeze(this.json);
    deepFreeze(this.whenStrings);
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

  getWhenString(when) {
    return this.whenStrings[when];
  }

  async buildMessage(now, prop) {
    const regExp = this.fillingKeyRegExp();
    const template = await this.getTemplate(now, prop);
    const fillings = await this.getFillings(now, prop);

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
      return (key === KEY_PERIODIC) ? false : new RegExp(props[key].regexp, 'i').test(subject);
    });
  }

  async getReply(subject, now = new Date()) {
    const props = this.getMessageProps();
    const whenKey = (REGEXP_TOMORROW.test(subject)) ? WHEN_TOMORROW : WHEN_TODAY;

    const regExpFull = new RegExp(props[KEY_FULL].regexp, 'i');
    if (regExpFull.test(subject)) {
      const propsFull = Object.assign({ when: whenKey }, props[KEY_FULL]);
      return [{
        pos: subject.search(regExpFull),
        message: await this.buildMessage(now, propsFull)
      }].filter((v) => v.message);
    }

    const replies = [];
    for (const key in props) {
      if (!props[key].regexp) {
        continue;
      }

      const regExp = new RegExp(props[key].regexp, 'i');
      if (regExp.test(subject)) {
        const propsSingle = Object.assign({ when: whenKey }, props[key]);
        replies.push({
          pos: subject.search(regExp),
          message: await this.buildMessage(now, propsSingle)
        });
      }
    };
    return replies.filter((v) => v.message);
  }

  async getMessage(now = new Date()) {
    const props = this.getMessageProps()[KEY_PERIODIC];
    const messages = [];

    for (const prop of props) {
      const propsSingle = Object.assign({
        when: WHEN_TODAY
      }, prop);
      messages.push({
        pos: 0,
        message: await this.buildMessage(now, propsSingle)
      });
    }
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

  async getTemplate(now, messageProps) {
    throw new Error('Not impmelented, Override is required.')
  }

  async getFillings(now, messageProps) {
    throw new Error('Not impmelented, Override is required.')
  }
}
