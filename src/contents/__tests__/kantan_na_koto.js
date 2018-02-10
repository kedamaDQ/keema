import KantanNaKoto from '../kantan_na_koto';

describe('KantanNaKoto', () => {
  const keywords = [
    'へぇ～！いいね！',
    'へぇー！いいね！',
    'ヘェ～！いいね！',
    'へぇ～！イイネ！',
    '簡単なこと',
    'かんたんなこと',
    'ほしいなぁ……',
    '欲しいなぁ',
    'ばくれちゅわ',
    'グローバルスター',
    'ぐろーばるすたー'
  ];

  describe('hasReply', () => {
    const knk = new KantanNaKoto();
    for (const keyword of keywords) {
      test(`Check to hook keyword: ${keyword}`, () => {
        expect(knk.hasReply(keyword)).toBeTruthy();
      });
    }
  });

  describe('getReply', () => {
    const knk = new KantanNaKoto();
    for (const keyword of keywords) {
      test(`Check properties: ${keyword}`, () => {
        return knk.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply).toHaveProperty('pos');
            expect(reply).toHaveProperty('message');
          });
        })
        .catch((e) => {
          console.log(e);
        })
      });
      test(`Check to message is not empty: ${keyword}`, () => {
        return knk.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply).toEqual(expect.anything());
          });
        })
        .catch((e) => {
          console.log(e);
        })
      })
      test(`Check no placeholders left. ${keyword}`, () => {
        return knk.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply.message).not.toEqual(expect.stringMatching(/KEY__/));
          });
        })
        .catch((e) => {
          console.log(e);
        })
      });
    }
  });
});
