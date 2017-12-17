export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const LAST_DAY_OF_MONTH = -1;

export const lastDayOfMonth = (date) => {
  return new Date(
    new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - DAY
  ).getDate();
}

export const elapsedMonths = (fromDate, toDate) => {
  return (
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth())
  );
}

export const isStartOfMonth = (date) => {
  return (date.getDate() === 1);
}

export const isEndOfMonth = (date) => {
  return (new Date(date.getTime() + 1 * DAY).getMonth() !== date.getMonth());
}

export const elapsedPeriods = (fromDate, toDate, resetDays) => {
  const startOffset = (fromDate.getDate() >= resetDays[resetDays.length - 1]) ?
    resetDays.length :
    resetDays.findIndex((resetDay) => {
      return (fromDate.getDate() < resetDay);
    });

  const periodOfThisMonth = (toDate.getDate() >= resetDays[resetDays.length - 1]) ?
    resetDays.length :
    resetDays.findIndex((resetDay) => {
      return (toDate.getDate() < resetDay);
    });

  return elapsedMonths(fromDate, toDate) * resetDays.length + periodOfThisMonth - startOffset;
}

export const isStartOfPeriod = (date, resetDays) => {
  if (isEndOfMonth(date)) {
    return resetDays.includes(LAST_DAY_OF_MONTH);
  } else {
    return resetDays.includes(date.getDate());
  }
}

export const isEndOfPeriod = (date, resetDates) => {
  if (isStartOfMonth(date)) {
    return resetDates.includes(new Date(date.getTime() - 1 * DAY).getDate());
  } else {
    return resetDates.includes(date.getDate() - 1);
  }
}

export const elapsedDays = (fromDate, toDate) => {
  return Math.floor((toDate - fromDate) / DAY);
}
