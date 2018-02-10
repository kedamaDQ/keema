'use strict';

import ContentBase from './content_base';
import {
  KEY_FULL,
  KEY_PERIODIC
} from './content_base';
import {
  HOUR,
  elapsedDays
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

  offsetTime(now) {
    return new Date(now.getTime() - OFFSET_HOURS);
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
    if (messageProps.fillings_key === KEY_PERIODIC || messageProps.fillings_key === KEY_FULL) {
      const fillings = {};
      const foresdon = new Foresdon();
      this.enemies.forEach((enemy) => {
        fillings[`${enemy.key}Level`] = this.getLevel(this.offsetTime(now), enemy.offset);
        fillings[`${enemy.key}Display`] = enemy.display;
        fillings[`${enemy.key}Icon`] = foresdon.getMonster();
      });
      return fillings;
    } else {
      const fillings = {};
      this.enemies.find((enemy) => {
        if (enemy.key === messageProps.fillings_key) {
          fillings['name'] = enemy.name;
          fillings['level'] = this.getLevel(this.offsetTime(now), enemy.offset);
          return true;
        }
        return false;
      });
      return fillings;
    }
  }
}
