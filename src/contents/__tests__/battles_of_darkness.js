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
      bod.getReply(keyword).forEach((v) => {
        test(`Check length: ${keyword}`, () => {
          expect(v.message).toEqual(expect.anything());
        });
        test(`Check no placeholder left: ${keyword}`, () => {
          expect(v.message).not.toEqual(expected);
        });
      });
    }
  });

  describe('getMessage', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];
    const y = Date.now().getFullYear + 1;
    const bod = new BattlesOfDarkness();

    for (let m = 0; m < 12; m++) {
      for (let d = 1; d < 31; d++) {
        const subject = new Date(y, m, d, 6, 0, 0);
        bod.getMessage().forEach((v) => {
          test(`Check to message not empty. subject: ${subject}`, () => {
            expect(v.message).toEqual(expect.anything());
          })
          test(`Check no placeholder left. subject: ${subject}`, () => {
            expect(v.message).not.toEqual(expected);
          })
        });
      }
    }
  })
});
