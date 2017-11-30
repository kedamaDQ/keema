import ContentBase from './content_base';

const CONFIG = 'defence_army.json';
const START_TIME_OFFSET = (1000 * 60 * 60 * 6);  // 6 hours.

const fs = require('fs');

export default class DefenceArmy extends ContentBase {
  constructor(now = null) {
    super();
    const json = JSON.parse(fs.readFileSync(`${this.configDir()}/${CONFIG}`, {encoding: 'utf8'}));
    this.fragments = json.fragments;
    this.schedule = json.schedule;
    this.cycle = this.schedule.reduce((acc, value) => {
      return acc + value.duration;
    }, 0);
    if (now) {
      this.now = now;
    } else {
      this.now = this.jst();
    }
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

  currentFillings() {
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

  getMessage() {
    return this.buildMessage(this.fragments, this.currentFillings());
  }
}