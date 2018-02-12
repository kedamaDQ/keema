'use strict';

import ContentBase from './content_base';
import {
  KEY_FULL,
  KEY_PERIODIC,
  WHEN_TOMORROW,
  WHEN_TODAY
} from './content_base';
import {
  HOUR,
  elapsedDays,
  tomorrow
} from '../utils/date_utils';

import Foresdon from '../utils/foresdon_utils';

const CONFIG = 'battles_of_darkness.json';
const OFFSET_HOURS = 6 * HOUR;

export default class BattlesOfDarkness extends ContentBase {

  constructor() {
    super(CONFIG);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day,
    );
    this.templates = this.config().templates;
    this.enemies = this.config().fillings;
    this.levelNumbers = this.config().level_numbers;
    this.messageProps = this.config().message_props;
  }

  offsetTime(now, when) {
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
    return this.templates.find((template) => {
      return template.key === messageProps.template_key;
    });
  }

  async getFillings(now, messageProps) {
    const targetDate = this.offsetTime(now, messageProps.when);

    if (messageProps.fillings_key === KEY_PERIODIC || messageProps.fillings_key === KEY_FULL) {
      const fillings = {
        when: this.getWhenString(messageProps.when)
      };
      const foresdon = new Foresdon();
      for (const enemy of this.enemies) {
        fillings[`${enemy.key}Level`] = this.getLevel(targetDate, enemy.offset);
        fillings[`${enemy.key}Display`] = enemy.display;
        fillings[`${enemy.key}Icon`] = await foresdon.getMonster();
      }
      return fillings;
    } else {
      const fillings = {
        when: this.getWhenString(messageProps.when)
      };
      this.enemies.find((enemy) => {
        if (enemy.key === messageProps.fillings_key) {
          fillings['name'] = enemy.name;
          fillings['level'] = this.getLevel(targetDate, enemy.offset);
          return true;
        }
        return false;
      });
      return fillings;
    }
  }
}
