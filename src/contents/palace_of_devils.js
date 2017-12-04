import ContentBase from './content_base';
import {
  elapsedMonths
} from '../utils/date_utils';

const CONFIG = 'palace_of_devils.json';

export default class PalaceOfDevils extends ContentBase {

  constructor(now) {
    super(CONFIG);
    this.startDate = new Date(this.config().start_date);
    this.resetDates = this.config().reset_dates;
    this.fragments = this.config().fragments;
    this.enemies = this.config().enemies;
    this.now = (now) ? now : this.jst();
  }

  currentEnemyIndex() {
    if (this.now.date >= this.resetDates[this.resetDates.length - 1]) {
      // last part of the month.
      return (elapsedMonths() + 1) * this.resetDates.length;
    } else {
      // first or middle part of the month.
      const partOfMonth = this.resetDates.findIndex((resetDay) => {
        return (this.now.date >= resetDay);
      });
      return elapsedMonths() * this.resetDates.length + partOfMonth;
    }
  }

  nextEnemyIndex() {
    return (this.currentEnemyIndex() + 1) % this.enemies.length;
  }

  buildTolerances(tolerance) {
    if (tolerance.sepalated) {
      return tolerance.tolerances.map((t, i) => {
        return `${i}獄は${t.join("・")}`;
      }).join("、");
    } else {
      return tolerance.tolerances.join("・");
    }
  }

  currentFillings() {
    const enemy = this.enemies[this.currentEnemyIndex()];
    return {
      display: enemy.display,
      next_display: this.enemies[this.nextEnemyIndex()].display,
      members: enemy.members.join("と"),
      tolerances: this.buildTolerances(enemy.tolerance),
    };
  }

  getMessage() {

  }
}
