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
    super(CONFIG);
    this.messageProps = this.config().message_props;
    this.templates = this.config().templates;
    this.contents = this.config().fillings;
  }

  getMessageProps() {
    return this.messageProps;
  }

  getTemplate(now, messageProps) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    let prefix = "";
    if (messageProps.reset_days.includes(offsetted.getDate())) {
      prefix = "start";
    } else if (messageProps.reset_days.includes(nextDayOf(offsetted).getDate())) {
      prefix = "end";
    } else {
      return null;
    }
    return this.templates.find((t) => {
      return t.key === `${prefix}_${messageProps.template_key}`;
    });
  }

  getFillings(now, messageProps) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    const displays = this.contents.filter((c) => {
      if (c.key === messageProps.fillings_key) {
        return messageProps.reset_days.includes(offsetted.getDate()) ||
               messageProps.reset_days.includes(nextDayOf(offsetted).getDate());
      } else {
        return false;
      }
    }).map(c => c.display);

    if (displays.lengsh === 0) {
      return null;
    } else if (displays.length === 1) {
      return {displays: displays[0]};
    } else {
      const foresdon = new Foresdon();
      const displaysText = displays.map((d) => {
        return `${foresdon.getMonster()} ${d}`
      }).join('\n');
      return {displays: `\n${displaysText}\n`};
    }
  }

  getReply() {
    throw new Error('Not implemented.');
  }
}

/* for test, now buggy.
const pc = new PeriodicContents();
//console.log(pc.getMessage(new Date(2018, 0, 1, 6, 0, 0)));
//console.log(pc.getMessage(new Date(2018, 0, 9, 6, 0, 0)));
//console.log(pc.getMessage(new Date(2018, 0, 10, 6, 0, 0)));
//console.log(pc.getMessage(new Date(2018, 0, 14, 6, 0, 0)));
//console.log(pc.getMessage(new Date(2018, 0, 15, 6, 0, 0)));
//console.log(pc.getMessage(new Date(2018, 0, 28, 6, 0, 0)));
//console.log(pc.getMessage(new Date(2018, 0, 29, 6, 0, 0)));
console.log(pc.getMessage(new Date(2018, 0, 31, 6, 0, 0)));
*/
