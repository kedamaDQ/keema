import ContentBase from './content_base';

const CONFIG = 'battles_of_darkness.json';

export default class BattlesOfDarkness extends ContentBase {

  constructor(now) {
    super(CONFIG);
    this.now = (now) ? now : this.jst();
    this.startDate = new Date(this.config().start_date);
    this.enemies = this.config().enemies;
    this.greekNumbers = this.config().greek_numbers;
  }

  elapsedDays() {
    return Math.floor((this.now - this.startDate) / 1000 / 60 / 60 / 24);
  }

  currentLevel(offset) {
    return this.greekNumbers[
      (this.elapsedDays() + offset) % this.greekNumbers.length
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
