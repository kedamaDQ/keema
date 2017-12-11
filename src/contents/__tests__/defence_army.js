import DefenceArmy from '../defence_army';
import {
  MIN,
  HOUR,
  DAY
} from '../../utils/date_utils';

const enemies = new DefenceArmy().enemies;
const keywords = ['防衛軍', 'ぼうえいぐん'];

describe('DefenceArmy', () => {

  describe('hasReply', () => {
    for (const keyword of keywords) {
      const da = new DefenceArmy(keyword);
      test(`Check hook keyword: ${keyword}`, () => {
        expect(da.hasReply()).toBeTruthy();
      });
    }
  });


  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    for (const keyword of keywords) {
      const da = new DefenceArmy(keyword);
      test(`Check length. ${keyword}`, () => {
        expect(da.getReply().message.length).toBeGreaterThan(0);
      });
      test(`Check no placeholders left. ${keyword}`, () => {
          expect(da.getReply().message).not.toEqual(expected);
      });
    }
  });

  describe('getMessage', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ]

    const da = new DefenceArmy('');
    test('getMessage', () => {
      expect(da.getMessage().length).toBeGreaterThan(0);
      expect(da.getMessage()).not.toEqual(expected);
    })
  });
})
