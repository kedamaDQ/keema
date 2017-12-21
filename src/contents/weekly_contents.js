import ContentBase from './content_base';
import Foresdon from '../utils/foresdon_utils';
import {
  HOUR,
  DAY,
  nextDayOf
} from '../utils/date_utils';

const CONFIG = 'weekly_contents.json';
const OFFSET_HOURS = 6 * HOUR;

export default class WeeklyContents extends ContentBase {
  constructor() {
    super(CONFIG, null);
    this.fragments = this.config().fragments;
    this.contents = this.config().contents;
  }

  buildFillings(now) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    const displays = this.contents.filter((c => {
      return c.reset_days.includes(offsetted.getDay());
    })).map(c => c.display);

    if (displays.length === 0) {
      return null;
    } else if (displays.length === 1) {
      return {displays: displays[0]}
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
        fragments: this.fragments.start,
        fillings: this.buildFillings(now)
      },
      {
        fragments: this.fragments.end,
        fillings: this.buildFillings(nextDayOf(now))
      }
    ]
    .filter((v) => v.fillings)
    .map((v) => {
      return {
        pos: 0,
        message: this.buildMessage(v.fragments, v.fillings)
      };
    });
  }
}
