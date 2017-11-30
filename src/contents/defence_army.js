import ContentBase from './content_base';

const CONFIG = 'defence_army.json';
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