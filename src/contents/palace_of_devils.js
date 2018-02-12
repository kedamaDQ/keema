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
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day
    );
    this.resetDays = this.config().reset_days;
    this.messageProps = this.config().message_props;
    this.templates = this.config().templates;
    this.enemies = this.config().fillings;
  }

  offsetTime(now, when) {
    const d = new Date(now.getTime() - OFFSET_HOURS);
    return (when === WHEN_TOMORROW) ? tomorrow(d) : d;
  }

  getEnemyIndex(now) {
    return elapsedPeriods(
      this.startDate, now, this.resetDays
    ) % this.enemies.length;
  }

  getNextEnemyIndex(now) {
    return (this.getEnemyIndex(now) + 1) % this.enemies.length;
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
    if (isStartOfPeriod(this.offsetTime(now), this.resetDays)) {
      return this.templates.find((template) => {
        return template.key === 'first_day';
      });
    }

    if (isEndOfPeriod(this.offsetTime(now), this.resetDays)) {
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
    const enemy = this.enemies[this.getEnemyIndex(targetDate)];
    const nextEnemy = this.enemies[this.getNextEnemyIndex(targetDate)];
    return {
      when: this.getWhenString(messageProps.when),
      display: enemy.display,
      nextDisplay: nextEnemy.display,
      members: enemy.members.join("と"),
      tolerances: this.buildTolerances(enemy.tolerance),
    };
  }
}
