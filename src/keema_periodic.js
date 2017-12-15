import Mastodon from 'mastodon-api';

import PeriodicResetContents from './contents/periodic_reset_contents';
import BattlesOfDarkness from './contents/battles_of_darkness';
import PalaceOfDevils from './contents/palace_of_devils';

const POST_URL = '/statuses';

export default class KeemaPeriodic {

  constructor(env) {
//    this.M = new Mastodon(env);
  }

  buildDateString(now) {
    return [
      now.getFullYear(),
      ('0' + (now.getMonth() + 1).toString()).slice(-2),
      ('0' + now.getDate().toString()).slice(-2)
    ].join('-');
  }

  buildMessage(now) {
    return [
      `[${this.buildDateString(now)}]`,
      new PeriodicResetContents().getMessage(now).message,
      new BattlesOfDarkness().getMessage(now).message,
      new PalaceOfDevils().getMessage(now).message
    ].filter(v => v).join('\n\n');
  }

  postMessage(content) {
    this.M.post(POST_URL, content)
    .catch((e) => {
      throw e;
    })
    .then((resp) => {
      console.log(resp);
    });
  }

  toot(now = new Date()) {
    console.log(this.buildMessage(now));
//    this.postMessage(buildMessage(now));
  }
}

// TODO: Where is devils of next day??
// isEndOfPeriod and isStartOfPeriod have bugs.
const kp = new KeemaPeriodic({});
kp.toot();
kp.toot(new Date(2017, 11, 1, 6, 0, 0));
kp.toot(new Date(2017, 11, 9, 6, 0, 0));
kp.toot(new Date(2017, 11, 10, 6, 0, 0));
kp.toot(new Date(2017, 11, 14, 6, 0, 0));
kp.toot(new Date(2017, 11, 15, 6, 0, 0));
kp.toot(new Date(2017, 11, 19, 6, 0, 0));
kp.toot(new Date(2017, 11, 20, 6, 0, 0));
kp.toot(new Date(2017, 11, 24, 6, 0, 0));
kp.toot(new Date(2017, 11, 25, 6, 0, 0));
kp.toot(new Date(2017, 11, 30, 6, 0, 0));
kp.toot(new Date(2017, 11, 31, 6, 0, 0));
