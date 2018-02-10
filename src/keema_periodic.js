import Mastodon from 'mastodon-api';

import PeriodicContents from './contents/periodic_contents';
import WeeklyContents from './contents/weekly_contents';
import BattlesOfDarkness from './contents/battles_of_darkness';
import PalaceOfDevils from './contents/palace_of_devils';

const POST_URL = '/statuses';

export default class KeemaPeriodic {

  constructor(env) {
    this.M = new Mastodon(env);
  }

  buildDateString(now) {
    const dateString = [
      now.getFullYear(),
      ('0' + (now.getMonth() + 1).toString()).slice(-2),
      ('0' + now.getDate().toString()).slice(-2)
    ].join('-');

    return {
      pos: 0,
      message: `[${dateString}]`
    };
  }

  async buildMessage(now) {
    return new Array()
    .concat(  // Header string
      this.buildDateString(now)
    )
    .concat(  // Each contents
      await new PeriodicContents().getMessage(now),
      await new WeeklyContents().getMessage(now),
      await new BattlesOfDarkness().getMessage(now),
      await new PalaceOfDevils().getMessage(now)
    )
    .filter(v => v)
    .map(v => v.message)
    .join('\n\n');
  }

  postMessage(content) {
    const postData = {
      status: content
    };

    this.M.post(POST_URL, postData)
    .catch((e) => {
      throw e;
    })
    .then((resp) => {
      console.log(resp);
    });
  }

  toot(now = new Date()) {
    this.buildMessage(now)
    .then((res) => {
      this.postMessage(res);
    })
    .catch((e) => {
      console.log(e);
    });
  }
}
