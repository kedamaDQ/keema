import BattlesOfDarkness from '../battles_of_darkness';
import {
  MINUTE,
  HOUR,
  DAY
} from '../../utils/date_utils';

describe('BattlesOfDarkness', () => {
  const startDate = new BattlesOfDarkness('').startDate;
  const greekNumbers = new BattlesOfDarkness('').greekNumbers.slice(0);
  const enemiesLength = new BattlesOfDarkness('').enemies.length;
  const keywords = ['レグ', 'DK', 'イカ', '常闇'];

  describe('getLevel', () => {
    const bod = new BattlesOfDarkness();
    for (let i = 0; i < 366; i++) {

      const d0000 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i, 0, 0, 0);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${d0000}`, () => {
          expect(bod.getLevel(d0000, offset)).toBe(greekNumbers[(i + offset - 1) % greekNumbers.length]);
        });
      }

      const d0559 = new Date(d0000.getTime() + 5 * HOUR + 59 * MINUTE);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${d0559}`, () => {
          expect(bod.getLevel(d0559, offset)).toBe(greekNumbers[(i + offset - 1) % greekNumbers.length]);
        });
      }

      const d0600 = new Date(d0000.getTime() + 6 * HOUR);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${d0600}`, () => {
          expect(bod.getLevel(d0600, offset)).toBe(greekNumbers[(i + offset) % greekNumbers.length]);
        });
      }
    }
  });

  describe('hasReply', () => {
    for (const keyword of keywords) {
      const bod = new BattlesOfDarkness();
      test(`Check hook keyword: ${keyword}`, () => {
        expect(bod.hasReply(keyword)).toBeTruthy();
      });
    }
  });

  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    const bod = new BattlesOfDarkness();
    for (const keyword of keywords) {
      test(`Check length: ${keyword}`, () => {
        new Array().concat(bod.getReply(keyword)).forEach((v) => {
          expect(v.message.length).toBeGreaterThan(0);
        });
      });
      test(`Check no placeholder left: ${keyword}`, () => {
        new Array().concat(bod.getReply(keyword)).forEach((v) => {
          expect(v.message).not.toEqual(expected);
        })
      });
    }
  });
});
