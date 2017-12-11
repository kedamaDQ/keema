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

  constructor(subject, now = null) {
    super(CONFIG, TRIGGER_REGEXP, subject);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day
    );
    this.resetDays = this.config().reset_days;
    this.fragments = this.config().fragments;
    this.enemies = this.config().enemies;
    this.now = (now) ?
      new Date(now.getTime() - OFFSET_HOURS) :
      new Date(this.jst().getTime() - OFFSET_HOURS);
  }

  currentEnemyIndex() {
    return elapsedPeriods(this.startDate, this.now, this.resetDays) % this.enemies.length;
  }

  nextEnemyIndex() {
    return (this.currentEnemyIndex() + 1) % this.enemies.length;
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

  buildFillings() {
    const enemy = this.enemies[this.currentEnemyIndex()];
    return {
      display: enemy.display,
      next_display: this.enemies[this.nextEnemyIndex()].display,
      members: enemy.members.join("と"),
      tolerances: this.buildTolerances(enemy.tolerance),
    };
  }

  getReply() {
    console.log(this.fragments.full);
    console.log(this.buildFillings());
    return {
      pos: this.subject.search(TRIGGER_REGEXP),
      message: this.buildMessage(this.fragments.full, this.buildFillings())
    };
  }

  getMessage(full = false) {
    if (full) {
      return this.buildMessage(this.fragments.full, this.buildFillings());
    } else {
      return this.buildMessage(
        (isStartOfPeriod(this.now, this.resetDays)) ? this.fragments.first_day :
        (isEndOfPeriod(this.now, this.resetDays)) ? this.fragments.last_day :
        this.fragments.short,
        this.buildFillings()
      );
    }
  }

  getFullMessage() {
    return this.getMessage(true);
  }
}
