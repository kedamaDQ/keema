'use strict';

import ContentBase from './content_base';
import {
  KEY_FULL,
  KEY_PERIODIC,
  WHEN_TODAY,
  WHEN_TOMORROW
} from './content_base';
import {
  HOUR,
  elapsedMinutes
} from '../utils/date_utils';

const CONFIG = 'defence_army.json';
const OFFSET_HOURS = 6 * HOUR;

export default class DefenceArmy extends ContentBase {

  constructor() {
    super(CONFIG);
    this.startDate = new Date(
      this.config().start_date.year,
      this.config().start_date.month,
      this.config().start_date.day,
      this.config().start_date.hour,
      0, 0, 0
    );
    this.templates = this.config().templates;
    this.messageProps = this.config().message_props;
    this.enemies = this.config().fillings;
    this.cycle = this.enemies.reduce((acc, value) => {
      return acc + value.duration;
    }, 0);
  }

  readableMinutes(minutes) {
    if (minutes < 60) {
      return `${minutes}分`;
    } else if (minutes % 60 === 0) {
      return `${Math.floor(minutes / 60)}時間`;
    } else {
      return `${Math.floor(minutes / 60)}時間${minutes % 60}分`;
    }
  }

  currentEnemy(now) {
    let elapsed = elapsedMinutes(this.startDate, now) % this.cycle;
    const index = this.enemies.findIndex((v) => {
      if (elapsed - v.duration < 0) {
        return true;
      } else {
        elapsed -= v.duration;
        return false;
      }
    });
    return { index, elapsed };
  }

  /* Override pseudo abstract methods. */
  getMessageProps() {
    return this.messageProps;
  }

  async getTemplate(now, messageProps) {
    if (!messageProps.template_key) {
      throw new Error('Periodical message is not Implemented.');
    }
    if (messageProps.when === WHEN_TOMORROW) {
      return this.templates.find((template) => {
        return template.key === 'unknown';
      });
    }

    const key = (this.enemies[this.currentEnemy(now).index].key === "random") ?
      "full" : "full_with_tolerances";
    return this.templates.find((template) => {
      return template.key === key;
    });
  }

  async getFillings(now, messageProps) {
    const currentEnemy = this.currentEnemy(now);
    const currentIndex = currentEnemy.index;
    const nextIndex = (currentIndex + 1) % this.enemies.length;
    const fillings = {
      currentDisplay: this.enemies[currentIndex].display,
      nextDisplay: this.enemies[nextIndex].display,
      remain: this.readableMinutes(this.enemies[currentIndex].duration - currentEnemy.elapsed),
    };

    if (this.enemies[currentIndex].tolerances) {
      fillings.tolerances = this.enemies[currentIndex].tolerances.join("・");
    }
    return fillings;
  }
}
