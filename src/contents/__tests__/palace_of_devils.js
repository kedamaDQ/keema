import PalaceOfDevils from '../palace_of_devils';

const now = new Date();
const y = now.getFullYear() + 1;
const m = now.getMonth();

const enemies = new PalaceOfDevils().enemies;
const resetDays = new PalaceOfDevils().resetDays;

describe('PalaceOfDevils', () => {
  describe.skip('elapsedEnemyIndex', () => {

  })

  describe('currentEnemyIndex', () => {

    test('6 hours offsetted.(At day 10th.)', () => {
      const pod1 = new PalaceOfDevils(new Date(y, m, 9, 0, 0, 0));    // 2017-12-09T00:00:00
      const pod2 = new PalaceOfDevils(new Date(y, m, 10, 5, 59, 59)); // 2017-12-10T05:59:59
      const pod3 = new PalaceOfDevils(new Date(y, m, 10, 6, 0, 0));   // 2017-12-10T06:00:00
      expect(pod1.currentEnemyIndex()).toBe(pod2.currentEnemyIndex());
      expect(pod1.currentEnemyIndex()).not.toBe(pod3.currentEnemyIndex());
    });

    test('6 hours offsetted.(At day 25th.)', () => {
      const pod1 = new PalaceOfDevils(new Date(y, m, 24, 0, 0, 0));   // 2017-12-24T00:00:00
      const pod2 = new PalaceOfDevils(new Date(y, m, 25, 5, 59, 59)); // 2017-12-25T05:59:59
      const pod3 = new PalaceOfDevils(new Date(y, m, 25, 6, 0, 0));   // 2017-12-25T06:00:00
      expect(pod1.currentEnemyIndex()).toBe(pod2.currentEnemyIndex());
      expect(pod1.currentEnemyIndex()).not.toBe(pod3.currentEnemyIndex());
    });

    const base = new PalaceOfDevils(new Date(y, 0, resetDays[0], 6, 0, 0)).currentEnemyIndex();
    for (let i = 0; i < enemies.length; i++) {
      const subject = new Date(
        y,                                // year
        Math.floor(i / resetDays.length), // month
        resetDays[i % resetDays.length],  // day
        6, 0, 0);
      const expected = (base + i) % enemies.length;
      test(`on: ${subject} expected: ${base}`, () => {
        expect(new PalaceOfDevils(subject).currentEnemyIndex()).toBe(expected);
      });
    }
  })

  describe('nextEnemyIndex', () => {

  })

  describe('getMessage', () => {
    const pod1 = new PalaceOfDevils(new Date(2017, 11, 8, 0, 0, 0));
    const pod2 = new PalaceOfDevils(new Date(2017, 11, 9, 0, 0, 0));
    const pod3 = new PalaceOfDevils(new Date(2017, 11, 10, 6, 0, 0));
    const pod4 = new PalaceOfDevils(new Date(2017, 11, 11, 6, 0, 0));
    expect(pod1.getMessage().length > 0).toBeTruthy();
    expect(pod2.getMessage().length > 0).toBeTruthy();
    expect(pod3.getMessage().length > 0).toBeTruthy();
    expect(pod4.getMessage().length > 0).toBeTruthy();
  })
  describe('getFullMessage', () => {
    const pod1 = new PalaceOfDevils();
    expect(pod1.getMessage().length > 0).toBeTruthy();
  })
});
