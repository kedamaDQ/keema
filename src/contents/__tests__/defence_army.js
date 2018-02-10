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
    const da = new DefenceArmy();

    for (const keyword of keywords) {
      test(`Check properties: ${keyword}`, () => {
        return da.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply).toHaveProperty('pos');
            expect(reply).toHaveProperty('message');
          });
        })
        .catch((e) => {
          console.log(e);
        });
      });
      test(`Check any value ${keyword}`, () => {
        return da.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply.message).toEqual(expect.anything());
          });
        })
        .catch((e) => {
          console.log(e);
        });
      });
      test(`Check no placeholders left: ${keyword}`, () => {
        return da.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply.message).not.toEqual(expect.stringMatching(/KEY__/));
          });
        })
        .catch((e) => {
          console.log(e);
        });
      });
    }
  });
});
