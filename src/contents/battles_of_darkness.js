import ContentBase from './content_base';

const CONFIG = 'battle_of_darkness.json';
const START_TIME_OFFSET = 1000 * 60 * 60 * 6; // 6 hours.

export default class BattlesOfDarkness extends ContentBase {

  constructor(now) {
    super(CONFIG);
    this.now = (now) ? now : this.jst();
    this.startDate = new Date(this.config().startDate);
    this.enemies = this.config().enemies;
    this.greekNumbers = this.config().greek_numbers;
  }

  elapsedDays() {
    const offsetted = new Date(this.now.getTime() - START_TIME_OFFSET);
    return Math.floor((this.now - offsetted) / 1000 / 60 / 60 / 24);
  }

  currentFillings() {
    const fillings = {};
    Object.keys(this.enemies).forEach((key) => {
      const enemy = this.enemies[key];
      fillings[`${key}Level`] = this.greekNumbers[
        (this.elapsedDays() + enemy.offset) % this.enemies.length
      ];
      fillings[`${key}Display`] = enemy.display;
    });
  }

  getMessage() {
    return this.buildMessage(this.config().flagments, this.currentFillings())
  }
}
