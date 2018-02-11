import Mastodon from 'mastodon-api';

import PeriodicContents from './contents/periodic_contents';
import WeeklyContents from './contents/weekly_contents';
import WeeklyActivity from './contents/weekly_activity';
import BattlesOfDarkness from './contents/battles_of_darkness';
import PalaceOfDevils from './contents/palace_of_devils';
import { buildDateString } from './utils/date_utils';

const POST_URL = '/statuses';

export default class KeemaPeriodic {

  constructor(env) {
    this.M = new Mastodon(env);
  }

  async buildMessage(now) {
    return new Array()
    .concat(  // Header string
      [{
        pos: 0,
        message: `[${buildDateString(now)}]`
      }]
    )
    .concat(  // Each contents
      await new PeriodicContents().getMessage(now),
      await new WeeklyContents().getMessage(now),
      await new BattlesOfDarkness().getMessage(now),
      await new PalaceOfDevils().getMessage(now),
      await new WeeklyActivity().getMessage(now)
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
