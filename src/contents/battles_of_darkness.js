import ContentBase from './content_base';
import Foresdon from '../utils/foresdon_utils';

import {
  HOUR,
  elapsedDays
} from '../utils/date_utils';

const CONFIG = 'battles_of_darkness.json';
const OFFSET_HOURS = 6 * HOUR;

export default class BattlesOfDarkness extends ContentBase {

  constructor() {
    super(CONFIG, null);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day,
    );
    this.fragments = this.config().fragments;
    this.enemies = this.config().enemies;
    this.greekNumbers = this.config().greek_numbers;
    this.triggers = this.config().triggers;
  }

  getLevel(now, offset) {
    return this.greekNumbers[
      (
        elapsedDays(this.startDate, new Date(now.getTime() - OFFSET_HOURS)) + offset
      ) % this.greekNumbers.length
    ];
  }

  buildSingleFillings(now, key) {
    const fillings = {};
    this.enemies.find((enemy) => {
      if (enemy.key === key) {
        fillings['name'] = enemy.name;
        fillings['level'] = this.getLevel(now, enemy.offset);
        return true;
      }
      return false;
    });
    return fillings;
  }

  buildFullFillings(now) {
    const fillings = {};
    const foresdon = new Foresdon();
    this.enemies.forEach((enemy) => {
      fillings[`${enemy.key}Level`] = this.getLevel(now, enemy.offset);
      fillings[`${enemy.key}Display`] = enemy.display;
      fillings[`${enemy.key}Icon`] = foresdon.getMonster();
    });
    return fillings;
  }

  buildSingleMessage(now, key) {
    return this.buildMessage(
      this.fragments.single,
      this.buildSingleFillings(now, key)
    );
  }

  buildFullMessage(now) {
    return this.buildMessage(
      this.fragments.full,
      this.buildFullFillings(now)
    );
  }

  hasReply(subject) {
    return Object.keys(this.triggers).some((key) => {
      return new RegExp(this.triggers[key], 'i').test(subject);
    });
  }

  getReply(subject, now = new Date()) {
    const regexpFull = new RegExp(this.triggers.full, 'i');
    if (regexpFull.test(subject)) {
      return[{
        pos: subject.search(regexpFull),
        message: this.buildFullMessage(now)
      }];
    }

    const replies = [];
    Object.keys(this.triggers).forEach((key) => {
      const regexp = new RegExp(this.triggers[key], 'i');
      if (regexp.test(subject)) {
        replies.push({
          pos: subject.search(regexp),
          message: this.buildSingleMessage(now, key)
        });
      }
    });
    return replies;
  }

  getMessage(now = new Date()) {
    return [{
      pos: 0,
      message: this.buildFullMessage(now)
    }];
  }
}
