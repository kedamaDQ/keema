'use strict';

import ContentBase from './content_base';
import Foresdon from '../utils/foresdon_utils';
import {
  WEEK,
  buildDateString
} from '../utils/date_utils';

const CONFIG = 'weekly_activity.json';

export default class WeeklyActivity extends ContentBase {
  constructor() {
    super(CONFIG);
    this.messageProps = this.config().message_props;
    this.templates = this.config().templates;
    this.tootWdays = this.config().toot_wdays;
  }

  isDayToToot(now) {
    return this.tootWdays.some((wday) => wday === now.getDay());
  }

  getMessageProps() {
    return this.messageProps;
  }

  async getTemplate(now, messageProps) {
    if (!this.isDayToToot(now)) {
      return null;
    }
    return this.templates.find((t) => {
      return (t.key === messageProps.template_key);
    })
  }

  async getFillings(now, messageProps) {
    if (!this.isDayToToot(now)) {
      return null;
    }
    const foresdon = new Foresdon();
    return foresdon.getActivityLastWeek()
    .then((activity) => {
      const startDate = new Date(activity.week * 1000);
      const endDate = new Date(startDate.getTime() + WEEK - 1);
      return Object.assign(
        {},
        activity,
        {
          startDate: buildDateString(startDate),
          endDate : buildDateString(endDate)
        }
      );
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    })
  }

  async getReply() {
    throw new Error('Not implemented.');
  }
}
