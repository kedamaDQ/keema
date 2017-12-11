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
    for (const keyword of keywords) {
      test(`Check to hook keyword: ${keyword}`, () => {
        expect(new KantanNaKoto(keyword).hasReply()).toBeTruthy();
      });
    }
  });

  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    for (const keyword of keywords) {
      const knk = new KantanNaKoto(keyword);
      test(`Check length. ${keyword}`, () => {
        expect(knk.getReply().length).toBeGreaterThan(0);
      });
      test(`Check no placeholders left. ${keyword}`, () => {
          expect(knk.getReply().message).not.toEqual(expected);
      });
    }

  });
});
