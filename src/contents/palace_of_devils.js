'use strict';

import ContentBase from './content_base';
import {
  KEY_FULL,
  KEY_PERIODIC,
  WHEN_TODAY,
  WHEN_TOMORROW
} from './content_base';
import {
  HOUR,
  elapsedPeriods,
  isStartOfPeriod,
  isEndOfPeriod,
  tomorrow
} from '../utils/date_utils';

const CONFIG = 'palace_of_devils.json';
const OFFSET_HOURS = 6 * HOUR;

export default class PalaceOfDevils extends ContentBase {

  constructor() {
    super(CONFIG);
    this.startDates = this.config().start_dates;
    this.resetDays = this.config().reset_days;
    this.messageProps = this.config().message_props;
    this.templates = this.config().templates;
    this.enemies = this.config().fillings;
  }

  offsetTime(now, when) {
    const d = new Date(now.getTime() - OFFSET_HOURS);
    return (when === WHEN_TOMORROW) ? tomorrow(d) : d;
  }

  getDataIndex(now) {
//    if (now.getDate() < this.resetDays[0]) {
//      return this.resetDays.length - 1;
//    }

    const dataIdx = this.resetDays.findIndex((resetDay) => {
      return resetDay > now.getDate();
    }) - 1;
//    return (dataIdx === -1) ? this.resetDays.length - 1 : dataIdx;
    return (dataIdx < 0) ? this.resetDays.length - 1 : dataIdx;
  }

  getEnemyIndex(now) {
    const idx = this.getDataIndex(now);
    return elapsedPeriods(
      new Date(
        this.startDates[idx].year,
        this.startDates[idx].month,
        this.startDates[idx].day
      ),
      now,
      [this.resetDays[idx]]
    ) % this.enemies[idx].length;
  }

  getNextEnemyIndex(now) {
    const idx = (this.getDataIndex(now) + 1) % this.resetDays.length;
    const currentIndex = elapsedPeriods(
      new Date(
        this.startDates[idx].year,
        this.startDates[idx].month,
        this.startDates[idx].day,
      ),
      now,
      [this.resetDays[idx]]
    ) + 1;
    return currentIndex % this.enemies[idx].length;
  }

  buildTolerances(tolerance) {
    if (tolerance.sepalated) {
      return tolerance.tolerances.map((t, i) => {
        return `${i + 1}獄は${t.join("・")}`;
      }).join("、");
    } else {
      return tolerance.tolerances.join("・");
    }
  }

  /* Override pseudo abstract methods. */
  getMessageProps() {
    return this.messageProps;
  }

  async getTemplate(now, messageProps) {
    if (messageProps.template_key) {
      return this.templates.find((template) => {
        return template.key === messageProps.template_key;
      });
    }

    // messageProps.template_key === null
    const offsetted = this.offsetTime(now);
    const idx = this.getDataIndex(offsetted);
    if (isStartOfPeriod(offsetted, this.resetDays)) {
      return this.templates.find((template) => {
        return template.key === 'first_day';
      });
    }

    if (isEndOfPeriod(offsetted, this.resetDays)) {
      return this.templates.find((template) => {
        return template.key === 'last_day';
      });
    }

    return this.templates.find((template) => {
      return template.key === 'short';
    });
  }

  async getFillings(now, messageProps) {
    const targetDate = this.offsetTime(now, messageProps.when);
    const idx = this.getDataIndex(targetDate);
    const enemy = this.enemies[idx][this.getEnemyIndex(targetDate)];
    const nextEnemy = this.enemies[(idx + 1) % this.resetDays.length][this.getNextEnemyIndex(targetDate)];
    return {
      when: this.getWhenString(messageProps.when),
      display: enemy.display,
      nextDisplay: nextEnemy.display,
      members: enemy.members.join("と"),
      tolerances: this.buildTolerances(enemy.tolerance),
    };
  }
}

//const pod = new PalaceOfDevils();
//pod.getMessage(new Date(2018, 1, 1, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 1, 9, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 1, 10, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 1, 11, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 1, 24, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 1, 25, 7, 0, 0)).then(data => console.log(data));
//
//pod.getMessage(new Date(2018, 2, 1, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 2, 9, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 2, 10, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 2, 15, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 2, 24, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 2, 25, 7, 0, 0)).then(data => console.log(data));
//
//pod.getMessage(new Date(2018, 3, 1, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 3, 9, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 3, 10, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 3, 15, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 3, 24, 7, 0, 0)).then(data => console.log(data));
//pod.getMessage(new Date(2018, 3, 25, 7, 0, 0)).then(data => console.log(data));
//
