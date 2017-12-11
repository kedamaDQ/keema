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

  describe('currentLevel', () => {
    for (let i = 0; i < 366; i++) {
      const tDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i, 0, 0, 0);

      const bod0000 = new BattlesOfDarkness('', tDate);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${tDate}`, () => {
          expect(bod0000.currentLevel(offset)).toBe(greekNumbers[(i + offset - 1) % greekNumbers.length]);
        });
      }

      const bod0559 = new BattlesOfDarkness('', new Date(tDate.getTime() + 5 * HOUR + 59 * MINUTE));
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${bod0559.now}`, () => {
          expect(bod0559.currentLevel(offset)).toBe(greekNumbers[(i + offset - 1) % greekNumbers.length]);
        });
      }

      const bod0600 = new BattlesOfDarkness('', new Date(tDate.getTime() + 6 * HOUR));
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${bod0600.now}`, () => {
          expect(bod0600.currentLevel(offset)).toBe(greekNumbers[(i + offset) % greekNumbers.length]);
        });
      }
    }
  });

  describe('hasReply', () => {
    for (const keyword of keywords) {
      const bod = new BattlesOfDarkness(keyword);
      test(`Check hook keyword: ${keyword}`, () => {
        expect(bod.hasReply()).toBeTruthy();
      });
    }
  });

  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    for (const keyword of keywords) {
      const bod = new BattlesOfDarkness(keyword);
      test(`Check length: ${keyword}`, () => {
        new Array().concat(bod.getReply()).forEach((v) => {
          expect(v.message.length).toBeGreaterThan(0);
        });
      });
      test(`Check no placeholder left: ${keyword}`, () => {
        new Array().concat(bod.getReply()).forEach((v) => {
          expect(v.message).not.toEqual(expected);
        })
      });

    }
  });

  describe('getMessage', () => {
    const bod = new BattlesOfDarkness('');
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    for (const type of [null, 'regnad', 'darkking', 'medb']) {
      test(`${type}`, () => {
        expect(bod.getMessage(type).length).toBeGreaterThan(0);
        expect(bod.getMessage(type)).not.toEqual(expected);
      });
    }
  });
});
