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

<<<<<<< HEAD
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

    
=======
  buildWeeklyMessage(now) {
    const wDayOfToday = new Date(now.getTime() - OFFSET_HOURS).getDay();
    const wDayOfTomorrow = (wDayOfToday) + 1 % 7;
>>>>>>> 3b7e97cd27152771f02b4231f4d3969ef30a84db
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
