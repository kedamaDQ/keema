import {
  elapsedMonths,
  isStartOfMonth,
  isEndOfMonth,
  isStartOfPeriod,
  isEndOfPeriod,
  lastDayOfMonth,
} from '../date_utils'

const years = [1996, 2000, 2001, 2002, 2003, 2004, 2010, 2016, 2017, 2018, 2020, 2100, 2200];
const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

describe('elapsedMonths', () => {
  const fromDate = new Date(2017, 6, 1);
  let tobe = -18;
  for (const y of [2016, 2017, 2018]) {
    for (const m of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      const toDate = new Date(y, m, 1);
      test(`from ${fromDate} to ${toDate}`, () => {
        expect(elapsedMonths(fromDate, toDate)).toBe(tobe++);
      });
    }
  }
});

describe('isStartOfMonth', () => {
  // Day 1.
  for (const y of years) {
    for (const m of months) {
      test('day 1', () => {
        expect(isStartOfMonth(new Date(y, m, 1))).toBeTruthy();
      });
    }
  }

  // Day 2.
  for (const y of [2016, 2017, 2018]) {
    for (const m of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      const subject = new Date(y, m, 2);
      test(`Day 2: ${subject}`, () => {
        expect(isStartOfMonth(subject)).toBeFalsy();
      });
    }
  }
});

describe('isEndOfMonth',  () => {

  // Day 1.
  for (const y of years) {
    for (const m of months) {
      const subject = new Date(y, m, 1);
      test(`Day 1: ${subject}`, () => {
        expect(isEndOfMonth(subject)).toBeFalsy();
      });
    }
  }

  // Day 2.
  for (const y of years) {
    for (const m of months) {
      const subject = new Date(y, m, 2);
      test(`Day 2: ${subject}`, () => {
        expect(isEndOfMonth(subject)).toBeFalsy();
      })
    }
  }

  // Last day of month.
  for (const y of years) {
    for (const m of months) {
      const d = (m !== 1) ? daysOfMonth :
        ((y % 4) !== 0) ? 28 :
        ((y % 400) === 0) ? 29 :
        ((y % 100) === 0) ? 28 : 29;
      const subject = new Date(y, m, d);
      test(`Last day of month: ${subject}`, () => {
        expect(isEndOfMonth(subject)).toBeTruthy();
      })
    }
  }
});

describe('isStartOfPeriod', () => {

});
describe('isEndOfPeriod', () => {

});
describe('lastDayOfMonth', () => {

});
