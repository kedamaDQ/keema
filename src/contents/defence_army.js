'use strict';

import ContentBase from './content_base';
import {
  KEY_FULL,
  KEY_PERIODIC
} from './content_base';
import {
  HOUR
} from '../utils/date_utils';

const CONFIG = 'defence_army.json';
const OFFSET_HOURS = 6 * HOUR;

export default class DefenceArmy extends ContentBase {

  constructor() {
    super(CONFIG);
    this.templates = this.config().templates;
    this.messageTypes = this.config().message_types;
    this.enemies = this.config().fillings;
    this.cycle = this.enemies.reduce((acc, value) => {
      return acc + value.duration;
    }, 0);
  }

  offsetTime(now) {
    return new Date(now.getTime() - OFFSET_HOURS);
  }

  getMinutesOfWeek(now) {
    return (now.getDay() * 24 * 60) + (now.getHours() * 60) + now.getMinutes();
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

  /* Override pseudo abstract methods. */
  getMessageTypes() {
    return this.messageTypes;
  }

  getTemplate(now, templateKey) {
    if (!templateKey) {
      throw new Error('Periodical message is not Implemented.');
    }
    return this.templates.find((template) => {
      return template.key === templateKey;
    });
  }

  getFillings(now, fillingsKey) {
    const fillings = {};
    let elapsed = this.getMinutesOfWeek(now) % this.cycle;
    this.enemies.find((v, i) => {
      if (elapsed - this.enemies[i].duration < 0) {
        fillings.currentDisplay = v.display;
        fillings.nextDisplay = this.enemies[(i + 1) % this.enemies.length].display;
        fillings.remain = this.readableMinutes(v.duration - elapsed);
        return true;
      } else {
        elapsed -= v.duration;
        return false;
      }
    });
    return fillings;
  }
}
