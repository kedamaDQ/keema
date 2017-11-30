const JST_OFFSET = 1000 * 60 * 60 * 9;

export default class ContentBase {
  configDir() {
    return (__dirname + '/../../config');
  }

  regExpKey() {
    return new RegExp(/^KEY__([a-zA-Z]+)$/);
  }

  jst(date = new Date()) {
    date.setTime(date.getTime() + JST_OFFSET);
    return date;
  }

  buildMessage(fragments, fillings) {
    const regExpKey = this.regExpKey();

    return fragments.map((v) => {
      if (regExpKey.test(v)) {
        return fillings[RegExp.$1];
      } else {
        return v;
      }
    }).join('');
  }
}