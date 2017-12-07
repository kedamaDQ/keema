import {
  elapsedMonths,
  isStartOfMonth,
  isEndOfMonth,
  isStartOfPeriod,
  isEndOfPeriod,
  lastDayOfMonth,
} from '../date_utils'

describe('elapsedMonths', () => {
  test('Check return from 10 years ago to 10 years later.', () => {
    const from = new Date(2017, 6, 1);
    let tobe = -17;
    for (let y of [2016, 2017, 2018]) {
      for (let m of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
        expect(elapsedMonths(from, new Date(y, m, 1))).toBe(tobe++);
      }
    }
  });

  describe('isStartOfMonth', () => {
    test('day 1', () => {
      for (let y of [2016, 2017, 2018]) {
        for (let m of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
          expect(isStartOfMonth(new Date(y, m, 1))).isTruthy();
        }
      }
    });
    test('day 2', () => {
      for (let y of [2016, 2017, 2018]) {
        for (let m of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
          expect(isStartOfMonth(new Date(y, m, 2))).isFalsy();
        }
      }
    });
  });
  describe('isEndOfMonth',  () => {
    const years = [1996, 2000, 2001, 2002, 2003, 2004, 2100,];
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    test('day 1', () => {
      for (let y of years) {
        for (let m of months) {
          expect(isEndOfMonth(new Date(y, m, 1))).isFalsy();
        }
      }
    });
    test('day 2', () => {
      for (let y of years) {
        for (let m of months) {
          expect(isEndOfMonth(new Date(y, m, 2))).isFalsy();
        }
      }
    });
    test('last day of month', () => {
      for (let y of years) {
        for (let m of months) {
          const d = ((y % 4) !== 0) ? 28 :
            ((y % 400) === 0) ? 29 :
            ((y % 100) === 0) ? 28 : 29;
          expect(isEndOfMonth(new Date(y, m, d))).isTruthy();
        }
      }
    });
  });
  describe('isStartOfPeriod', () => {

  });
  describe('isEndOfPeriod', () => {

  });
  describe('lastDayOfMonth', () => {

  });
});
