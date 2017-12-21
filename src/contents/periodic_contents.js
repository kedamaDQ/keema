import ContentBase from './content_base';
import Foresdon from '../utils/foresdon_utils';
import {
  HOUR,
  DAY,
  nextDayOf
} from '../utils/date_utils';

const CONFIG = 'periodic_contents.json';
const OFFSET_HOURS = 6 * HOUR;

const TYPE_PERIODIC = 'periodic';
const TYPE_ONESHOT = 'oneshot';

export default class PeriodicContents extends ContentBase {
  constructor() {
    super(CONFIG, null);
    this.fragments = this.config().fragments;
    this.contents = this.config().contents;
  }

  buildFillings(now, type) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    const displays = this.contents.filter((c) => {
      return c.type === type && c.reset_days.includes(offsetted.getDate());
    }).map(c => c.display);

    if (displays.length === 0) {
      return null;
    } else if (displays.length === 1) {
      return {displays: displays[0]};
    } else {
      const foresdon = new Foresdon();
      const displaysText = displays.map((d) => {
        return `${foresdon.getMonster()}${d}`
      }).join('\n');
      return {displays: `\n${displaysText}\n`};
    }
  }

  getReply() {
    throw new Error('Not implemented.');
  }

  getMessage(now = new Date()) {
    return [
      {
        fragments: this.fragments.oneshot.start, 
        fillings: this.buildFillings(now, TYPE_ONESHOT)
      },
      {
        fragments: this.fragments.oneshot.end,
        fillings: this.buildFillings(nextDayOf(now), TYPE_ONESHOT)
      },
      {
        fragments: this.fragments.periodic.start,
        fillings: this.buildFillings(now, TYPE_PERIODIC)
      },
      {
        fragments: this.fragments.periodic.end,
        fillings: this.buildFillings(nextDayOf(now), TYPE_PERIODIC)
      }
    ]
    .filter(v => v.fillings)
    .map((v) => {
      return {
        pos: 0,
        message: this.buildMessage(v.fragments, v.fillings)
      }
    });
  }
}

const pc = new PeriodicContents();

console.log(pc.getMessage(new Date(2017, 10, 30, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 1, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 9, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 10, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 14, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 15, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 24, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 25, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 29, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 30, 6, 0, 0)));
console.log(pc.getMessage(new Date(2017, 11, 31, 6, 0, 0)));
