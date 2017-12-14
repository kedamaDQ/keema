const fs = require('fs');

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

  hasReply() {
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
