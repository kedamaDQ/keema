import ContentBase from './content_base';
import {
  HOUR,
  elapsedDays
} from '../utils/date_utils';

const CONFIG = 'battles_of_darkness.json';
const OFFSET_HOURS = 6 * HOUR;

export default class BattlesOfDarkness extends ContentBase {

  constructor(now) {
    super(CONFIG);
    this.startDate = new Date(this.config().start_date);
    this.enemies = this.config().enemies;
    this.greekNumbers = this.config().greek_numbers;
    this.now = (now) ?
      new Date(now.getTime() - OFFSET_HOURS) :
      new Date(this.jst().getTime() - OFFSET_HOURS);
  }

  currentLevel(offset) {
    return this.greekNumbers[
      (elapsedDays(this.startDate, this.now) + offset) % this.greekNumbers.length
    ];
  }

  currentFillings(key) {
    const fillings = {};
    if (key) {
      this.enemies.find((enemy) => {
        if (enemy.key === key) {
          fillings['name'] = enemy.name;
          fillings['level'] = this.currentLevel(enemy.offset);
          return true;
        }
        return false;
      });
    } else {
      this.enemies.forEach((enemy) => {
        fillings[`${enemy.key}Level`] = this.currentLevel(enemy.offset);
        fillings[`${enemy.key}Display`] = enemy.display;
      });
    }
    return fillings;
  }

  getMessage(key = null) {
    return this.buildMessage(
      (key) ? this.config().fragments_single : this.config().fragments,
      this.currentFillings(key))
  }
}
