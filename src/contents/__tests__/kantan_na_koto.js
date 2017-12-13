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
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    const knk = new KantanNaKoto();
    for (const keyword of keywords) {
      test(`Check length. ${keyword}`, () => {
        expect(knk.getReply(keyword).message.length).toBeGreaterThan(0);
      });
      test(`Check no placeholders left. ${keyword}`, () => {
          expect(knk.getReply(keyword).message).not.toEqual(expected);
      });
    }

  });
});
