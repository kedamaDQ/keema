import ContentBase from './content_base';
import {
  HOUR
} from '../utils/date_utils';

const CONFIG = 'defence_army.json';
const START_TIME_OFFSET = 6 * HOUR;
const TRIGGER_REGEXP = new RegExp(/(?:防衛軍|ぼうえいぐん)/);

export default class DefenceArmy extends ContentBase {
  constructor(subject, now = null) {
    super(CONFIG, TRIGGER_REGEXP, subject);
    this.fragments = this.config().fragments;
    this.schedule = this.config().schedule;
    this.cycle = this.schedule.reduce((acc, value) => {
      return acc + value.duration;
    }, 0);
    this.now = (now) ? now : this.jst();
  }

  minutesOfWeek() {
    const offsetted = new Date(this.now.getTime() + START_TIME_OFFSET);
    return (offsetted.getDay() * 24 * 60) + (offsetted.getHours() * 60) + offsetted.getMinutes();
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
    this.schedule.find((v, i) => {
      if (elapsed - this.schedule[i].duration < 0) {
        fillings.currentDisplay = v.display;
        fillings.nextDisplay = this.schedule[(i + 1) % this.schedule.length].display;
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
