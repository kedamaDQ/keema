const fs = require('fs');

const JST_OFFSET = 1000 * 60 * 60 * 9;

export default class ContentBase {

  constructor(config, triggerRegExp, subject) {
    this.json = (config) ?
      JSON.parse(fs.readFileSync(`${this.configDir()}/${config}`, {encoding: 'utf8'})) :
      null;
    this.subject = subject;
    this.trigger = triggerRegExp;
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

  jst(date = new Date()) {
    date.setTime(date.getTime() + JST_OFFSET);
    return date;
  }

  buildMessage(fragments, fillings) {
    const regExp = this.fillingKeyRegExp();

    return fragments.map((v) => {
      if (regExp.test(v)) {
        return fillings[RegExp.$1];
      } else {
        return v;
      }
    }).join('');
  }

  hasReply() {
    console.log(this.subject);
    console.log(this.trigger);
    console.log(this.trigger.test(this.subject));
    return this.trigger.test(this.subject);
  }

  // Override this method.
  getReply() {
    return '';
  }

  // Override this method.
  getMessage() {
    return '';
  }
}
