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
      da.getReply(keyword).forEach((v) => {
        test(`Check length. ${keyword}`, () => {
          expect(v.message).toEqual(expect.anything());
        });
        test(`Check no placeholders left. ${keyword}`, () => {
            expect(v.message).not.toEqual(expected);
        });
      })
    }
  });
});
