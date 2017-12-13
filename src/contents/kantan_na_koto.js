import ContentBase from './content_base';

const CONFIG = 'kantan_na_koto.json';

export default class KantanNaKoto extends ContentBase {
  constructor() {
    super(CONFIG, null);
    this.contents = this.config().contents.map((v) => {
      return {
        regexp: new RegExp(v.regexp),
        fragments: v.fragments
      };
    });
  }

  hasReply(subject) {
    return this.contents.some((v) => {
      return v.regexp.test(this.subject);
    });
  }

  getReply(subject) {
    const found = this.contents.find((v) => {
      return v.regexp.test(this.subject);
    });
    return found.fragments.join('');
  }
}
