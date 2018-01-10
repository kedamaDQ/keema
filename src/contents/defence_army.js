import ContentBase from './content_base';
import {
  HOUR
} from '../utils/date_utils';

const CONFIG = 'defence_army.json';
const OFFSET_HOURS = 6 * HOUR;

export default class DefenceArmy extends ContentBase {

  constructor() {
    super(CONFIG);
    this.fragments = this.config().fragments;
    this.triggers = this.config().triggers;
    this.enemies = this.config().enemies;
    this.cycle = this.enemies.reduce((acc, value) => {
      return acc + value.duration;
    }, 0);
  }

  getTriggers() {
    return this.triggers;
  }

  getMinutesOfWeek(now) {
    const n = new Date(now.getTime() - OFFSET_HOURS);
    return (n.getDay() * 24 * 60) + (n.getHours() * 60) + n.getMinutes();
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

  buildFillings(now) {
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

  getReply(subject, now = new Date()) {
    return [{
      pos: subject.search(new RegExp(this.triggers['full'], 'i')),
      message: this.buildMessage(this.fragments, this.buildFillings(now))
    }];
  }

  getMessage() {
    throw new Error('Not implemented.');
  }
}
