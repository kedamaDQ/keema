export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

export const elapsedMonths = (fromDate, toDate) => {
  /* throw error if elapsedMonths is negative? */
  return (
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth())
  );
}

export const isStartOfMonth = (date) => {
  return (date.getDate() === 1);
}

export const isEndOfMonth = (date) => {
  return (new Date(date.getTime() + DAY).getMonth() !== date.getMonth());
}

export const isStartOfPeriod = (date, resetDays) => {
  return resetDays.some((d) => {
    if (d === -1) {
      return (lastDayOfMonth(date) === date.getDate());
    } else {
      return (d === date.getDate());
    }
  });
}

export const isEndOfPeriod = (date, resetDates) => {
  return resetDates.some((d) => {
    if (d === -1) {
      return ((lastDayOfMonth(date) - 1) === date.getDate());
    } else if (d === 1) {
      return (lastDayOfMonth(date) === date.getDate());
    } else {
      return ((d - 1) === date.getDate());
    }
  });
}

export const lastDayOfMonth = (date) => {
  return new Date(
    new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - DAY
  ).getDate();
}
