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
    super(CONFIG);
    this.messageProps = this.config().message_props;
    this.templates = this.config().templates;
    this.contents = this.config().fillings;
  }

  getMessageProps() {
    return this.messageProps;
  }

  async getTemplate(now, messageProps) {
    return this.templates.find((t) => {
      return (t.key === messageProps.template_key);
    })
  }

  async getFillings(now, messageProps) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    const subject =
      (messageProps.fillings_key === 'start') ? offsetted.getDay() :
      (messageProps.fillings_key === 'end') ? nextDayOf(offsetted).getDay() : null;
    const displays = this.contents.filter((c => {
      return c.reset_days.includes(subject);
    })).map(c => c.display);

    if (displays.length === 0) {
      return null;
    } else if (displays.length === 1) {
      return {displays: displays[0]}
    } else {
      const foresdon = new Foresdon();
      const displaysText = displays.map((d) => {
        return `${foresdon.getMonster()} ${d}`
      }).join('\n');
      return {displays: `\n${displaysText}\n`};
    }
  }

  async getReply() {
    throw new Error('Not implemented.');
  }
}
