import ContentBase from './content_base';
import {
  HOUR,
  elapsedPeriods,
  isStartOfPeriod,
  isEndOfPeriod
} from '../utils/date_utils';

const CONFIG = 'palace_of_devils.json';
const TRIGGER_REGEXP = new RegExp(/(?:邪神|邪心|じゃしん)/);
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
    this.fragments = this.config().fragments;
    this.enemies = this.config().enemies;
  }

  getEnemyIndex(now) {
    return elapsedPeriods(
      this.startDate, new Date(now.getTime() - OFFSET_HOURS), this.resetDays
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

  buildFillings(now) {
    const enemy = this.enemies[this.getEnemyIndex(now)];
    return {
      display: enemy.display,
      nextDisplay: this.enemies[this.getNextEnemyIndex(now)].display,
      members: enemy.members.join("と"),
      tolerances: this.buildTolerances(enemy.tolerance),
    };
  }

  getReply(subject, now = new Date()) {
    return [{
      pos: subject.search(TRIGGER_REGEXP),
      message: this.buildMessage(this.fragments.full, this.buildFillings(now))
    }];
  }

  getMessage(now = new Date()) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    if (isStartOfPeriod(offsetted, this.resetDays)) {
      return [{
        pos: 0,
        message: this.buildMessage(this.fragments.first_day, this.buildFillings(now))
      }];
    } else if (isEndOfPeriod(offsetted, this.resetDays)) {
      return [{
        pos: 0,
        message: this.buildMessage(this.fragments.last_day, this.buildFillings(now))
      }];
    } else {
      return [{
        pos: 0,
        message: this.buildMessage(this.fragments.short, this.buildFillings(now))
      }];
    }
  }
}

