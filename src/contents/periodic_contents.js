import ContentBase from './content_base';
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

  async getTemplate(now, messageProps) {
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

  async getFillings(now, messageProps) {
    const offsetted = new Date(now.getTime() - OFFSET_HOURS);
    if (
      !messageProps.reset_days.includes(offsetted.getDate()) &&
      !messageProps.reset_days.includes(nextDayOf(offsetted).getDate())
    ) {
      return null;
    }

    return {
      display: this.contents.find((c) => {
        return (c.key === messageProps.fillings_key);
      }).display
    };
  }

  getReply() {
    throw new Error('Not implemented.');
  }
}
