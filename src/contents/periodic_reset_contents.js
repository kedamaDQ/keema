import ContentBase from './content_base';
import {
  HOURS
} from '../utils/date_utils';

CONFIG = 'periodic_reset_contents.json';
OFFSET_HOURS = 6 * HOUR;

export default class PeriodicResetContents extends ContentBase {

  constructor() {
    super(CONFIG, null);
    this.contents = this.config().contents;
    this.fragments = this.config().fragments;
  }

  buildFillings() {

  }

  buildWeeklyMessage(now) {
    const today = new Date(now.getTime() - OFFSET_HOURS).getDay();
    const tomorrow = (today) + 1 % 7;

    const startContents = [];
    const endContents = [];

    this.contents.forEach((v) => {
      if (v.weekly) {
        if (v.reset.includes(today)) {
          startContents.push(v.display);
        } else if (v.reset.includes(tomorrow)) {
          endContents.push(v.display);
        }
      }
    });

    
  }

  getMessage(now = new Date()) {

  }

  hasReply(subject) {
    throw new Error('Not implemented.');
  }

  getReply(subject) {
    throw new Error('Not implemented.');
  }
}
