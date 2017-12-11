import ContentBase from './content_base';
import {
  HOUR
} from '../utils/date_utils';

const CONFIG = 'defence_army.json';
const OFFSET_HOURS = 6 * HOUR;
const TRIGGER_REGEXP = new RegExp(/(?:防衛軍|ぼうえいぐん)/);

export default class DefenceArmy extends ContentBase {
  constructor(subject, now = new Date()) {
    super(CONFIG, TRIGGER_REGEXP, subject);
    this.fragments = this.config().fragments;
    this.enemies = this.config().enemies;
    this.cycle = this.enemies.reduce((acc, value) => {
      return acc + value.duration;
    }, 0);
    this.now = new Date(now.getTime() - OFFSET_HOURS);
  }

  minutesOfWeek() {
    return (this.now.getDay() * 24 * 60) + (this.now.getHours() * 60) + this.now.getMinutes();
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

  buildFillings() {
    const fillings = {};
    let elapsed = this.minutesOfWeek() % this.cycle;
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

  getReply() {
    return {
      pos: this.subject.search(TRIGGER_REGEXP),
      message: this.buildMessage(this.fragments, this.buildFillings())
    };
  }

  getMessage() {
    return this.buildMessage(this.fragments, this.buildFillings());
  }
}
