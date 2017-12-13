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

  buildWeeklyMessage(now) {
    const wDayOfToday = new Date(now.getTime() - OFFSET_HOURS).getDay();
    const wDayOfTomorrow = (wDayOfToday) + 1 % 7;
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
