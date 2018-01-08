const fs = require('fs');

export default class ContentBase {

  constructor(config) {
    this.json = (config) ?
      JSON.parse(fs.readFileSync(`${this.configDir()}/${config}`, {encoding: 'utf8'})) :
      null;
    this.triggers = this.json.triggers || {};
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
    return Object.keys(this.triggers).some((key) => {
      return new RegExp(this.triggers[key], 'i').test(subject);
    });
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
