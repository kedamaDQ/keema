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
    const da = new DefenceArmy();
    for (const keyword of keywords) {
      test(`Check hook keyword: ${keyword}`, () => {
        expect(da.hasReply(keyword)).toBeTruthy();
      });
    }
  });


  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    const da = new DefenceArmy();
    for (const keyword of keywords) {
      test(`Check length. ${keyword}`, () => {
        expect(da.getReply(keyword).message.length).toBeGreaterThan(0);
      });
      test(`Check no placeholders left. ${keyword}`, () => {
          expect(da.getReply(keyword).message).not.toEqual(expected);
      });
    }
  });
});
