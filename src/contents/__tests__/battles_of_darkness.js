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

  describe('currentLevel', () => {
    for (let i = 0; i < 2; i++) {
      const tDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i, 0, 0, 0));

      const bod0000 = new BattlesOfDarkness('', new Date(tDate.getTime() + 1 * MINUTE));
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`day: ${i}, offset:${offset} at ${tDate}`, () => {
          expect(bod0000.currentLevel(offset)).toBe(greekNumbers[(i + offset - 1) % greekNumbers.length]);
        });
      }

      const bod0559 = new BattlesOfDarkness('', new Date(tDate.getTime() + 5 * HOUR + 59 * MINUTE));
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`day: ${i}, offset:${offset} at ${bod0559.now}`, () => {
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
