'use strict';

import ContentBase, {
  KEY_FULL,
  KEY_PERIODIC,
  WHEN_TOMORROW,
  WHEN_TODAY
} from './content_base';
import {
  HOUR,
  tomorrow,
  elapsedDays
} from '../utils/date_utils';

const CONFIG = 'holy_guardians.json';
const OFFSET_HOURS = 6 * HOUR;

export default class HolyGuardians extends ContentBase {

  constructor() {
    super(CONFIG);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day
    );
    this.templates = this.config().templates;
    this.fillings = this.config().fillings;
    this.levelNumbers = this.config().level_numbers;
    this.messageProps = this.config().message_props;
  }

  offsetDate(now, when) {
    const d = new Date(now.getTime() - OFFSET_HOURS);
    return (when === WHEN_TOMORROW) ? tomorrow(d) : d;
  }

  getLevel(now, offset) {
    return this.levelNumbers[
      (
        elapsedDays(this.startDate, now) + offset
      ) % this.levelNumbers.length
    ];
  }

  /* Override pseudo abstract methods. */
  getMessageProps() {
    return this.messageProps;
  }

  async getTemplate(now, messageProps) {
    return this.templates.find(t => t.key === messageProps.template_key);
  }

  async getFillings(now, messageProps) {
    const targetDate = this.offsetDate(now, messageProps.when);
    if (targetDate.getTime() < this.startDate.getTime()) {
      return null;
    }

    const enemy = this.fillings[0];
    return {
      when: this.getWhenString(messageProps.when),
      level: this.getLevel(targetDate, enemy.offset),
      display: enemy.display
    }
  }
}
