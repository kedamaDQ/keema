const fs = require('fs');

export default class ContentBase {

  constructor(config, triggerRegExp) {
    this.json = (config) ?
      JSON.parse(fs.readFileSync(`${this.configDir()}/${config}`, {encoding: 'utf8'})) :
      null;
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

  hasReply(subject) {
    return this.trigger.test(subject);
  }

  // Override this method.
  getReply(subject) {
    return '';
  }

  // Override this method.
  getMessage() {
    return '';
  }
}
