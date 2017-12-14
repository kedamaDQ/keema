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
    this.listHeaders = this.config().list_headers.slice(0);
  }

  buildMessage(fragments, day, isWeekly) {
    const fillings = this.buildFillings(day, isWeekly);
    return (fillings) ? super.buildMessage(fragments, fillings) : null;
  }

  buildFillings(day, isWeekly) {
    const displays = [];
    const contents = this.contents.filter((c) => {
      return (c.weekly === isWeekly && c.reset_days.includes(day));
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
      this.buildMessage(
        this.fragments.start_weekly,
        offsetted.getDay(),
        true
      ),
      this.buildMessage(
        this.fragments.end_weekly,
        (offsetted.getDay() + 1) % 7,
        true
      ),
      this.buildMessage(
        this.fragments.start_periodic,
        offsetted.getDate(),
        false
      ),
      this.buildMessage(
        this.fragments.end_periodic,
        new Date(offsetted.getTime() + 1 * DAY).getDate(),
        false
      )
    ].filter(v => v); 
  }

  hasReply(subject) {
    throw new Error('Not implemented.');
  }

  getReply(subject) {
    throw new Error('Not implemented.');
  }
}

/*
const prc = new PeriodicResetContents();
console.log('today:' + prc.getMessage());
console.log('1201: ' + prc.getMessage(new Date(2017, 11, 1, 10, 0, 0)));
console.log('1202: ' + prc.getMessage(new Date(2017, 11, 2, 10, 0, 0)));
console.log('1203: ' + prc.getMessage(new Date(2017, 11, 3, 10, 0, 0)));
console.log('1209: ' + prc.getMessage(new Date(2017, 11, 9, 10, 0, 0)));
console.log('1210: ' + prc.getMessage(new Date(2017, 11, 10, 10, 0, 0)));
console.log('1215: ' + prc.getMessage(new Date(2017, 11, 14, 10, 0, 0)));
console.log('1215: ' + prc.getMessage(new Date(2017, 11, 15, 10, 0, 0)));
console.log('1231: ' + prc.getMessage(new Date(2017, 11, 31, 10, 0, 0)));
*/
