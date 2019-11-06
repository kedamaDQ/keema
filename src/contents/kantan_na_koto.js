import ContentBase from './content_base';

const CONFIG = 'kantan_na_koto.json';

export default class KantanNaKoto extends ContentBase {
  constructor() {
    super(CONFIG);
    this.contents = this.config().contents.map((v) => {
      return {
        regexp: new RegExp(v.regexp),
        fragments_list: v.fragments_list
      };
    });
  }

  hasReply(subject) {
    return this.contents.some((v) => {
      return v.regexp.test(subject);
    });
  }

  async getReply(subject) {
    const found = this.contents.find((v) => {
      return v.regexp.test(subject);
    });

    const index = new Date().getSeconds() % found.fragments_list.length;
    return [{
      pos: 0,
      message: found.fragments_list[index].join('')
    }];
  }

  async getMessage() {
    throw new Error('Not implemented.');
  }
}

new KantanNaKoto().getReply("ﾍﾟｯﾀﾝｺ").then((res) => console.log(res));
