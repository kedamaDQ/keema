import ContentBase from './content_base';
import Foresdon from '../utils/foresdon_utils';
import {
  HOUR,
  DAY
} from '../utils/date_utils';

const CONFIG = 'periodic_reset_contents.json';
const OFFSET_HOURS = 6 * HOUR;

export default class PeriodicResetContents extends ContentBase {

  constructor() {
    super(CONFIG, null);
    this.contents = this.config().contents;
    this.fragments = this.config().fragments;
    this.foresdon = new Foresdon();
  }

  buildMessage(fragments, day, type) {
    const fillings = this.buildFillings(day, type);
    return (fillings) ? super.buildMessage(fragments, fillings) : null;
  }

  buildFillings(day, type) {
    const displays = [];
    const contents = this.contents.filter((c) => {
      return (c.type === type && c.reset_days.includes(day));
    }).sort((a, b) => {
      return a.sort_order - b.sort_order;
    });
    
    if (contents.length === 0) {
      return null;
    }

    if (contents.length === 1) {
      return {
        displays: contents[0].display
      };
    } else {
      const withHeader = contents.map((v) => {
        return `${this.foresdon.getMonster()} ${v.display}`;
      }, this).join('\n');

      return {
        displays: `\n${withHeader}\n`
      };
    }
  }

  getMessage(now = new Date()) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    return [
      {
        pos: 0,
        message: this.buildMessage(
          this.fragments.oneshot.start,
          offsetted.getDate(),
          'oneshot'
        )
      },
      {
        pos: 0,
        message: this.buildMessage(
          this.fragments.oneshot.end,
          new Date(offsetted.getTime() + 1 * DAY).getDate(),
          'oneshot'
        )
      },
      {
        pos: 0,
        message: this.buildMessage(
          this.fragments.weekly.start,
          offsetted.getDay(),
          'weekly'
        ),
      },
      {
        pos: 0,
        message: this.buildMessage(
          this.fragments.weekly.end,
          (offsetted.getDay() + 1) % 7,
          'weekly'
        ),
      },
      {
        pos: 0,
        message: this.buildMessage(
          this.fragments.periodically.start,
          offsetted.getDate(),
          'periodically'
        ),
      },
      {
        pos: 0,
        message: this.buildMessage(
          this.fragments.periodically.end,
          new Date(offsetted.getTime() + 1 * DAY).getDate(),
          'periodically'
        )
      }
    ].filter(v => v.message); 
  }

  hasReply(subject) {
    throw new Error('Not implemented.');
  }

  getReply(subject) {
    throw new Error('Not implemented.');
  }
}
